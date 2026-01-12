# frozen_string_literal: true
require "pathname"

require './config.rb'

class MultiUploader
  attr_accessor :files
  attr_accessor :file_objects

  def perform_uploads
    openai = Config.openai_client
    @file_objects = files.map do |file|
      puts "uploading #{file} to openai ..."
      file_object = openai.files.create(
        file:Pathname(file),
        purpose: "user_data"
      )
      puts "uploaded #{file_object.filename} (#{file_object.bytes/1024}K)"
      file_object
    end
  end

  def process_uploads
    #yield("file-AWTyMpvRQZMiGn7Kd9k9j7","paper1.pdf")
    file_objects.map do |file_object|
      yield(file_object.id,file_object.filename)
    end
  end
end
