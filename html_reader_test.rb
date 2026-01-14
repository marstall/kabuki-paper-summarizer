require "bundler/setup"
require "json"
require "httparty"
require "nokogiri"
require "ruby-readability"

def usage!
  warn "Usage: ruby html_reader_test.rb <url>"
  exit 1
end

url = ARGV[0]
usage! if url.nil? || url.strip.empty?

resp = HTTParty.get(url, headers: { "User-Agent" => "kabuki-paper-summarizer/1.0" })

unless resp.respond_to?(:code) && resp.code.to_i == 200
  warn "HTTP request failed: status=#{resp.respond_to?(:code) ? resp.code : "unknown"}"
  exit 1
end

html = resp.body.to_s
if html.strip.empty?
  warn "Empty response body"
  exit 1
end

readable = Readability::Document.new(html)

title = readable.title.to_s.strip
content_html = readable.content.to_s
puts content_html

# content_doc = Nokogiri::HTML(content_html)
# paragraph_texts = content_doc.css("p").map { |p| p.text.to_s.gsub(/\s+/, " ").strip }.reject(&:empty?)
#
# paragraph_texts.each do |p|
#   puts p
#   puts "----------------"
# end

out = {
  url: url,
  title: title,
  paragraphs: paragraph_texts.each_with_index.map { |t, i| { index: i + 1, text: t } }
}

File.write("paragraphs.json", JSON.pretty_generate(out))
puts "Wrote paragraphs.json"
