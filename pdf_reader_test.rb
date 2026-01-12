# frozen_string_literal: true
require 'bundler/setup'

require 'json'
require 'net/http'
require 'optparse'
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
end.parse!

file_paths+=options[:file_paths] ? options[:file_paths].split(",") : []
puts "received the following files:"
file_paths.each do |file_path|
  puts file_path
end
puts ""

pdf_path = file_paths[0]

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
  req.body = JSON.dump({ "assetID" => asset_id, "elementsToExtract" => elements_to_extract })

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
      download_uri = find_download_uri(json)
      raise "Adobe job status is done but missing downloadUri. Payload: #{JSON.dump(json)}" if download_uri.nil? || download_uri.empty?
      return download_uri
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
location = adobe_extract_job_location(client_id: client_id, token: token, asset_id: asset[:asset_id], elements_to_extract: ["text"])
download_uri = adobe_poll_until_done(client_id: client_id, token: token, location: location)
download = download_bytes(download_uri)
zip_bytes = download.fetch(:bytes)

if download[:content_type]&.downcase&.include?("application/json")
  data = JSON.parse(zip_bytes)
  print_structured_metadata(data)
  puts "== Extracted Text =="
  puts extract_text_from_adobe_json(zip_bytes)
  exit(0)
end

unless zip_bytes.start_with?("PK\x03\x04".b) || zip_bytes.start_with?("PK\x05\x06".b) || zip_bytes.start_with?("PK\x07\x08".b)
  snippet = zip_bytes.byteslice(0, 500)
  snippet = snippet ? snippet.force_encoding("UTF-8") : ""
  raise "Downloaded asset is not a ZIP. content-type=#{download[:content_type].inspect} status=#{download[:status]}. First 500 bytes: #{snippet.inspect}"
end

puts extract_text_from_adobe_zip(zip_bytes)
