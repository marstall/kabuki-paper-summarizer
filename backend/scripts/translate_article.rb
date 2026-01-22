# frozen_string_literal: true
require_relative '../config/environment'
require_relative './logging'
require 'optparse'
require 'paint'

DISCOURSE_USERNAME = "ChrisMarstall"
DISCOURSE_CATEGORY_ID = 5

file_paths = $stdin.stat.pipe? ? $stdin.read.split("\n") : []


options = {}
OptionParser.new do |parser|
  parser.banner = "Usage: ruby translate_article.rb [options]"

  parser.on("-a", "--article-id [NUMBER]") do |i|
    options[:article_id] = i
  end
end.parse!

article = Article.find(options[:article_id])
if not article
  puts "article #{options[:article_id]} not found!"
  exit();
end
puts
line("processing article #{options[:article_id]} ...")
header(article.original_title,"title")

article.sections.each{|section|
  subheader(section.title,"section")
  section.paragraphs.each{|paragraph|
    subheader2(paragraph.title)
    body(paragraph.body)
  }
}
