# frozen_string_literal: true
require 'optparse'
require './multi_uploader.rb'
require './paper_summarizer.rb'
require './discourse/client.rb'
require './discourse/topic.rb'
require './discourse/topic_creator.rb'

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

uploader = MultiUploader.new
uploader.files =file_paths

begin
  uploader.perform_uploads
rescue => e
  puts "There was an error performing upload(s)"
  puts e.message
  exit(0)
end

puts "summarizing and uploading files ..."

uploader.process_uploads do |file_id,file_path|
  begin
    puts "summarizing file #{file_path} (#{file_id}) ..."
    paper_summarizer = PaperSummarizer.new
    paper_summarizer.prompt_path = options[:prompt_path]
    paper_summarizer.file_id = file_id
    summary = paper_summarizer.summarize
    puts "uploading #{file_path} summary with title #{summary[:title]} ..."
    topic = Discourse::Topic.new
    topic.username = DISCOURSE_USERNAME
    topic.title = summary[:title]
    topic.body = summary[:body]
    topic.tags = summary[:tags]
    topic.category_id = 5

    Discourse::TopicCreator.create(topic)
  # rescue => e
  #   puts "There was an error processing #{file_path}."
  #   puts e.message
  end
end


