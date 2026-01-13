# frozen_string_literal: true
require 'bundler/setup'

require 'fileutils'
require 'json'
require 'net/http'
require 'optparse'
require 'pathname'
require 'stringio'
require 'uri'

require 'zip'

PDF_PATH = "/Users/marstall/openai/kabuki-review-papers"
DISCOURSE_USERNAME = "ChrisMarstall"
DISCOURSE_CATEGORY_ID = 5

file_paths = $stdin.stat.pipe? ? $stdin.read.split("\n") : []

options = {}
OptionParser.new do |parser|
  parser.banner = "Usage: ls *.pdf | ruby example.rb [options]"

  parser.on("-f", "--files [ARRAY]") do |f|
    options[:file_paths] = f
  end
  parser.on("-p", "--prompt-path [STRING]") do |f|
    options[:prompt_path] = f
  end

  parser.on("-d", "--download-folder [STRING]") do |f|
    options[:download_folder] = f
  end

  parser.on("--paragraphs") do
    options[:paragraphs] = true
  end
end.parse!

file_paths+=options[:file_paths] ? options[:file_paths].split(",") : []
puts "received the following files:"
file_paths.each do |file_path|
  puts file_path
end
puts ""

pdf_path = file_paths[0]

download_folder = options[:download_folder]
if download_folder.nil? || download_folder.strip.empty?
  puts "Missing required --download-folder"
  exit(1)
end

unless Dir.exist?(download_folder)
  puts "Download folder does not exist: #{download_folder}"
  exit(1)
end

unless File.directory?(download_folder)
  puts "Download folder is not a directory: #{download_folder}"
  exit(1)
end

paragraphs_mode = options[:paragraphs] == true

def adobe_token(client_id:, client_secret:)
  uri = URI("https://pdf-services.adobe.io/token")
  req = Net::HTTP::Post.new(uri)
  req["Content-Type"] = "application/x-www-form-urlencoded"
  req.set_form_data({ "client_id" => client_id, "client_secret" => client_secret })

  res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(req) }
  raise "Adobe token request failed (#{res.code}): #{res.body}" unless res.is_a?(Net::HTTPSuccess)

  json = JSON.parse(res.body)
  json.fetch("access_token")
end

def adobe_create_asset(client_id:, token:, media_type:)
  uri = URI("https://pdf-services.adobe.io/assets")
  req = Net::HTTP::Post.new(uri)
  req["X-API-Key"] = client_id
  req["Authorization"] = "Bearer #{token}"
  req["Content-Type"] = "application/json"
  req.body = JSON.dump({ "mediaType" => media_type })

  res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(req) }
  raise "Adobe create asset failed (#{res.code}): #{res.body}" unless res.is_a?(Net::HTTPSuccess)

  json = JSON.parse(res.body)
  upload_uri = json["uploadUri"] || json["uploadURI"]
  asset_id = json["assetID"] || json["assetId"] || json["asset_id"]
  raise "Adobe create asset response missing uploadUri" if upload_uri.nil? || upload_uri.empty?
  raise "Adobe create asset response missing assetID" if asset_id.nil? || asset_id.empty?

  { upload_uri: upload_uri, asset_id: asset_id }
end

def adobe_upload_asset(upload_uri:, media_type:, file_path:)
  uri = URI(upload_uri)
  req = Net::HTTP::Put.new(uri)
  req["Content-Type"] = media_type
  req.body = File.binread(file_path)

  res = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(req) }
  raise "Adobe upload asset failed (#{res.code}): #{res.body}" unless res.is_a?(Net::HTTPSuccess)
end

def adobe_extract_job_location(client_id:, token:, asset_id:, elements_to_extract:)
  uri = URI("https://pdf-services.adobe.io/operation/extractpdf")
  req = Net::HTTP::Post.new(uri)
  req["x-api-key"] = client_id
  req["Authorization"] = "Bearer #{token}"
  req["Content-Type"] = "application/json"
  payload = { "assetID" => asset_id, "elementsToExtract" => elements_to_extract }
  if block_given?
    extra = yield
    payload.merge!(extra) if extra.is_a?(Hash)
  end
  req.body = JSON.dump(payload)

  res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(req) }
  unless res.code.to_i == 201
    raise "Adobe extract job create failed (#{res.code}): #{res.body}"
  end

  location = res["location"] || res["Location"]
  raise "Adobe extract job create missing Location header" if location.nil? || location.empty?
  location
end

def find_download_uri(value)
  case value
  when Hash
    value.each do |k, v|
      if k.to_s.downcase.include?("download") && v.is_a?(String) && v.start_with?("http")
        return v
      end

      found = find_download_uri(v)
      return found if found
    end
  when Array
    value.each do |v|
      found = find_download_uri(v)
      return found if found
    end
  end

  nil
end

def find_download_uris(value, acc = [])
  case value
  when Hash
    value.each do |k, v|
      if k.to_s.downcase.include?("download") && v.is_a?(String) && v.start_with?("http")
        acc << v
      end
      find_download_uris(v, acc)
    end
  when Array
    value.each { |v| find_download_uris(v, acc) }
  end

  acc
end

def adobe_poll_until_done(client_id:, token:, location:, sleep_seconds: 1, max_attempts: 120)
  uri = URI(location)

  max_attempts.times do
    req = Net::HTTP::Get.new(uri)
    req["x-api-key"] = client_id
    req["Authorization"] = "Bearer #{token}"

    res = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(req) }
    raise "Adobe job status failed (#{res.code}): #{res.body}" unless res.is_a?(Net::HTTPSuccess)

    json = JSON.parse(res.body)
    status = json["status"]

    if status == "done"
      download_uris = find_download_uris(json).uniq
      raise "Adobe job status is done but missing downloadUri. Payload: #{JSON.dump(json)}" if download_uris.empty?
      return { download_uris: download_uris, status_payload: json }
    end

    raise "Adobe job failed: #{res.body}" if status == "failed"

    sleep sleep_seconds
  end

  raise "Adobe job polling timed out"
end

def download_bytes(url, max_redirects: 5)
  uri = URI(url)
  redirects_left = max_redirects

  loop do
    req = Net::HTTP::Get.new(uri)
    res = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(req) }

    if res.is_a?(Net::HTTPRedirection)
      raise "Too many redirects downloading asset" if redirects_left <= 0
      location = res["location"] || res["Location"]
      raise "Redirect without Location header" if location.nil? || location.empty?
      uri = URI(location)
      redirects_left -= 1
      next
    end

    raise "Download failed (#{res.code}): #{res.body}" unless res.is_a?(Net::HTTPSuccess)

    body = res.body
    body = body.dup
    body.force_encoding(Encoding::BINARY)
    return { bytes: body, content_type: res["content-type"], status: res.code.to_i, headers: res.to_hash }
  end
end

def extract_text_from_adobe_zip(zip_bytes)
  io = StringIO.new(zip_bytes)
  text_parts = []

  Zip::File.open_buffer(io) do |zip|
    entry = zip.find_entry("structuredData.json")
    raise "Adobe result zip missing structuredData.json" if entry.nil?

    data = JSON.parse(entry.get_input_stream.read)
    elements = data["elements"] || []
    elements.each do |el|
      next unless el.is_a?(Hash)
      text = el["Text"]
      next if text.nil? || text.empty?
      text_parts << text
    end
  end

  text_parts.join("\n")
end

def structured_data_from_adobe_zip(zip_bytes)
  io = StringIO.new(zip_bytes)
  Zip::File.open_buffer(io) do |zip|
    entry = zip.find_entry("structuredData.json")
    raise "Adobe result zip missing structuredData.json" if entry.nil?
    return JSON.parse(entry.get_input_stream.read)
  end
end

def list_renditions_from_adobe_zip(zip_bytes)
  io = StringIO.new(zip_bytes)
  files = []

  Zip::File.open_buffer(io) do |zip|
    zip.each do |entry|
      next if entry.name.end_with?("/")
      next if entry.name == "structuredData.json"
      files << entry.name
    end
  end

  files
end

def extract_renditions_to_folder(zip_bytes, download_folder)
  io = StringIO.new(zip_bytes)
  extracted = []
  base = File.expand_path(download_folder)

  Zip::File.open_buffer(io) do |zip|
    zip.each do |entry|
      next if entry.name.end_with?("/")
      next if entry.name == "structuredData.json"

      target = File.expand_path(File.join(base, entry.name))
      unless target.start_with?(base + File::SEPARATOR) || target == base
        raise "Refusing to write zip entry outside download folder: #{entry.name}"
      end

      FileUtils.mkdir_p(File.dirname(target))
      File.binwrite(target, entry.get_input_stream.read)
      extracted << target
    end
  end

  extracted
end

def paragraphish_element?(el)
  return false unless el.is_a?(Hash)
  text = el["Text"]
  return false unless text.is_a?(String)
  t = text.strip
  return false if t.empty?

  short_limit = 200
  return false if t.length < short_limit

  path = el["Path"].to_s
  last = path.split("/").last.to_s
  return true if last.start_with?("P")
  return true if last == "LBody"
  return true if path.match?(/\/P(\[|$)/)

  # Fallback: some PDFs don't expose /P tags. Treat generic text-like elements as paragraph candidates.
  disallowed = ["Title", "H1", "H2", "H3", "Figure", "Table", "TH", "TR", "TOC", "TOCI"]
  return false if disallowed.any? { |d| last.start_with?(d) }
  true
end

def heading_element?(el)
  return false unless el.is_a?(Hash)
  path = el["Path"].to_s
  last = path.split("/").last.to_s
  ["Title", "H1", "H2", "H3"].any? { |h| last.start_with?(h) }
end

def bounds_box(el)
  b = el["Bounds"] || el["bounds"]
  return nil unless b.is_a?(Array) && b.length == 4
  x0, y0, x1, y1 = b
  return nil unless [x0, y0, x1, y1].all? { |v| v.is_a?(Numeric) }
  # normalize just in case
  left = [x0, x1].min
  right = [x0, x1].max
  bottom = [y0, y1].min
  top = [y0, y1].max
  { left: left, right: right, bottom: bottom, top: top }
end

def box_horizontal_overlap_ratio(a, b)
  overlap = [0, [a[:right], b[:right]].min - [a[:left], b[:left]].max].max
  denom = [a[:right] - a[:left], b[:right] - b[:left]].max
  return 0.0 if denom <= 0
  overlap.to_f / denom.to_f
end

def vertical_gap(a, b)
  # distance between boxes vertically (0 if overlapping)
  return 0.0 if a[:bottom] <= b[:top] && b[:bottom] <= a[:top]
  if a[:bottom] > b[:top]
    (a[:bottom] - b[:top]).to_f
  else
    (b[:bottom] - a[:top]).to_f
  end
end

def near_figure_or_table?(text_box, figure_box)
  return false if text_box.nil? || figure_box.nil?
  overlap = box_horizontal_overlap_ratio(text_box, figure_box)
  return false if overlap < 0.25

  gap = vertical_gap(text_box, figure_box)
  gap <= 60.0
end

def figure_or_table_element?(el)
  return false unless el.is_a?(Hash)
  path = el["Path"].to_s
  last = path.split("/").last.to_s
  return true if last.start_with?("Figure") || last.start_with?("Table")
  down = path.downcase
  down.include?("/figure") || down.include?("/table")
end

def collect_figure_table_boxes_by_page(elements)
  boxes = Hash.new { |h, k| h[k] = [] }
  elements.each do |el|
    next unless figure_or_table_element?(el)
    page = el["Page"].to_i
    box = bounds_box(el)
    next if box.nil?
    boxes[page] << box
  end
  boxes
end

def normalize_para_text(text)
  t = text.to_s
  t = t.gsub(/\s+/, " ").strip
  t
end

def extract_paragraphs(data)
  elements = data["elements"]
  return [] unless elements.is_a?(Array)

  figure_boxes_by_page = collect_figure_table_boxes_by_page(elements)

  abstract_marker_index = elements.find_index do |el|
    next false unless el.is_a?(Hash)
    txt = el["Text"].to_s.strip
    txt.casecmp("abstract").zero?
  end

  first_para_index = elements.find_index { |el| paragraphish_element?(el) }
  start_index = abstract_marker_index ? abstract_marker_index + 1 : first_para_index
  return [] if start_index.nil?

  collecting = true
  in_abstract = !abstract_marker_index.nil?
  collected = []
  current = nil

  stop_headings = ["references", "bibliography", "acknowledgements", "acknowledgments"]

  elements.each_with_index do |el, idx|
    next if idx < start_index

    if heading_element?(el)
      heading_text = el["Text"].to_s.strip
      heading_text_down = heading_text.downcase

      if stop_headings.include?(heading_text_down)
        collecting = false
        in_abstract = false
      elsif heading_text_down == "abstract"
        collecting = true
        in_abstract = true
      elsif collecting && in_abstract
        # first heading after abstract ends abstract section
        in_abstract = false
      end

      next
    end

    next unless collecting
    next unless paragraphish_element?(el)

    # Caption filter: skip paragraph elements that are spatially near a figure/table on the same page.
    page = el["Page"].to_i
    text_box = bounds_box(el)
    if text_box && !figure_boxes_by_page[page].empty?
      next if figure_boxes_by_page[page].any? { |fb| near_figure_or_table?(text_box, fb) }
    end

    # If the abstract marker itself is a paragraph-ish element, skip it.
    next if el["Text"].to_s.strip.casecmp("abstract").zero?

    path = el["Path"].to_s
    page = el["Page"].to_i
    text = normalize_para_text(el["Text"])
    next if text.empty?

    # Prefer grouping by explicit paragraph paths when present; otherwise treat each element as its own paragraph.
    is_explicit_para = path.match?(/\/P(\[|$)/) || path.split("/").last.to_s.start_with?("P")

    if is_explicit_para
      if current && current[:path] == path && current[:page] == page
        current[:text] = "#{current[:text]} #{text}".strip
      else
        current = { text: text, is_abstract: in_abstract, page: page, path: path }
        collected << current
      end
    else
      current = { text: text, is_abstract: in_abstract, page: page, path: path }
      collected << current
    end
  end

  collected.each_with_index.map do |p, i|
    {
      index: i + 1,
      text: p[:text],
      is_abstract: p[:is_abstract],
      page: p[:page]
    }
  end
end

def write_paragraphs_json(download_folder, paragraphs)
  out_path = File.join(download_folder, "paragraphs.json")
  File.write(out_path, JSON.pretty_generate({ paragraphs: paragraphs }))
  out_path
end

def element_path_type(element)
  path = element["Path"].to_s
  return nil if path.empty?
  last = path.split("/").last
  return nil if last.nil? || last.empty?
  last
end

def extract_title_from_elements(elements)
  title_el = elements.find { |el| el.is_a?(Hash) && element_path_type(el) == "Title" && el["Text"].is_a?(String) && !el["Text"].empty? }
  title_el&.dig("Text")
end

def extract_abstract_from_elements(elements)
  idx = elements.find_index do |el|
    next false unless el.is_a?(Hash)
    txt = el["Text"].to_s.strip
    txt.casecmp("abstract").zero?
  end
  return nil if idx.nil?

  abstract_lines = []
  elements[(idx + 1)..].to_a.each do |el|
    next unless el.is_a?(Hash)
    type = element_path_type(el)
    text = el["Text"].to_s.strip
    next if text.empty?

    break if ["H1", "H2", "H3", "Title"].include?(type)
    abstract_lines << text
  end

  abstract = abstract_lines.join("\n")
  abstract.empty? ? nil : abstract
end

def gather_assets_from_elements(elements)
  figures = []
  tables = []

  elements.each do |el|
    next unless el.is_a?(Hash)
    type = element_path_type(el)
    file_paths = el["filePaths"] || el["FilePaths"] || el["file_paths"]
    file_paths = [file_paths] if file_paths.is_a?(String)
    file_paths = file_paths.select { |p| p.is_a?(String) } if file_paths.is_a?(Array)
    file_paths = [] unless file_paths.is_a?(Array)

    if type == "Figure"
      figures << { text: el["Text"], file_paths: file_paths }
    elsif type == "Table"
      tables << { text: el["Text"], file_paths: file_paths }
    end
  end

  { figures: figures, tables: tables }
end

def print_structured_metadata(data)
  puts "== Adobe Extract Metadata =="

  version = data["version"]
  if version.is_a?(Hash)
    puts "version:"
    version.keys.sort.each { |k| puts "  #{k}: #{version[k]}" }
  end

  ["metadata", "extended_metadata"].each do |k|
    v = data[k]
    next unless v.is_a?(Hash)
    puts "#{k}:"
    v.keys.sort.each { |kk| puts "  #{kk}: #{v[kk]}" }
  end

  elements = data["elements"] || []
  if elements.is_a?(Array)
    inferred_title = extract_title_from_elements(elements)
    puts "title: #{inferred_title}" if inferred_title

    inferred_abstract = extract_abstract_from_elements(elements)
    if inferred_abstract
      puts "abstract:"
      puts inferred_abstract
    end

    type_counts = Hash.new(0)
    elements.each do |el|
      next unless el.is_a?(Hash)
      type = element_path_type(el)
      next if type.nil?
      type_counts[type] += 1
    end
    unless type_counts.empty?
      puts "element_counts:"
      type_counts.keys.sort.each { |t| puts "  #{t}: #{type_counts[t]}" }
    end

    assets = gather_assets_from_elements(elements)
    unless assets[:figures].empty?
      puts "figures:"
      assets[:figures].each_with_index do |fig, i|
        puts "  #{i + 1}:"
        puts "    text: #{fig[:text]}" if fig[:text].is_a?(String) && !fig[:text].empty?
        puts "    file_paths: #{fig[:file_paths].join(", ")}" unless fig[:file_paths].empty?
      end
    end
    unless assets[:tables].empty?
      puts "tables:"
      assets[:tables].each_with_index do |tbl, i|
        puts "  #{i + 1}:"
        puts "    text: #{tbl[:text]}" if tbl[:text].is_a?(String) && !tbl[:text].empty?
        puts "    file_paths: #{tbl[:file_paths].join(", ")}" unless tbl[:file_paths].empty?
      end
    end
  end
end

def extract_text_from_adobe_json(json_bytes)
  data = JSON.parse(json_bytes)
  elements = data["elements"] || []
  text_parts = []

  elements.each do |el|
    next unless el.is_a?(Hash)
    text = el["Text"]
    next if text.nil? || text.empty?
    text_parts << text
  end

  text_parts.join("\n")
end

client_id = ENV["PDF_SERVICES_CLIENT_ID"]
client_secret = ENV["PDF_SERVICES_CLIENT_SECRET"]
raise "Missing ENV PDF_SERVICES_CLIENT_ID" if client_id.nil? || client_id.empty?
raise "Missing ENV PDF_SERVICES_CLIENT_SECRET" if client_secret.nil? || client_secret.empty?

token = adobe_token(client_id: client_id, client_secret: client_secret)
asset = adobe_create_asset(client_id: client_id, token: token, media_type: "application/pdf")
adobe_upload_asset(upload_uri: asset[:upload_uri], media_type: "application/pdf", file_path: pdf_path)
location = adobe_extract_job_location(client_id: client_id, token: token,
                                      asset_id: asset[:asset_id],
                                      elements_to_extract: ["text", "tables"]) do
  { "renditionsToExtract" => ["figures", "tables"] }
end
poll_result = adobe_poll_until_done(client_id: client_id, token: token, location: location)
downloads = poll_result.fetch(:download_uris)

download = nil
zip_bytes = nil
json_download = nil

downloads.each do |uri|
  d = download_bytes(uri)
  bytes = d.fetch(:bytes)

  if bytes.start_with?("PK\x03\x04".b) || bytes.start_with?("PK\x05\x06".b) || bytes.start_with?("PK\x07\x08".b)
    download = d
    zip_bytes = bytes
    break
  end

  json_download ||= d if d[:content_type]&.downcase&.include?("application/json")
end

if zip_bytes.nil?
  if paragraphs_mode && json_download
    data = JSON.parse(json_download.fetch(:bytes))
    paragraphs = extract_paragraphs(data)
    out_path = write_paragraphs_json(download_folder, paragraphs)
    paragraphs.each do |p|
      puts p[:text]
      puts ""
    end
    puts out_path
    exit(0)
  end

  if json_download
    snippet = json_download[:bytes].byteslice(0, 500)
    snippet = snippet ? snippet.force_encoding("UTF-8") : ""
    raise "Adobe did not provide a ZIP for renditions. Got JSON instead. content-type=#{json_download[:content_type].inspect} status=#{json_download[:status]}. First 500 bytes: #{snippet.inspect}"
  end

  raise "Adobe did not provide a ZIP for renditions. Download URLs tried:\n#{downloads.join("\n")}"
end

unless zip_bytes.start_with?("PK\x03\x04".b) || zip_bytes.start_with?("PK\x05\x06".b) || zip_bytes.start_with?("PK\x07\x08".b)
  snippet = zip_bytes.byteslice(0, 500)
  snippet = snippet ? snippet.force_encoding("UTF-8") : ""
  raise "Downloaded asset is not a ZIP. content-type=#{download[:content_type].inspect} status=#{download[:status]}. First 500 bytes: #{snippet.inspect}"
end

puts "== Renditions =="
extracted = extract_renditions_to_folder(zip_bytes, download_folder)
puts extracted

#puts extract_text_from_adobe_zip(zip_bytes)

if paragraphs_mode
  data = structured_data_from_adobe_zip(zip_bytes)
  paragraphs = extract_paragraphs(data)
  out_path = write_paragraphs_json(download_folder, paragraphs)
  paragraphs.each do |p|
    puts p[:text]
    puts "--------------------------"
  end
  puts out_path
end
