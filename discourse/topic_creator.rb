# frozen_string_literal: true
require 'httparty'
require 'json'

require "./discourse/client.rb"
require "./discourse/topic.rb"


module Discourse
  class TopicCreator

    def TopicCreator.create(topic)
      client = Client.instance
      puts "uploading #{topic.title} to discourse ..."
      response = client.post("/posts.json",{
        "title":topic.title,
        "raw":topic.body,
        "category":topic.category_id,
        "tags":topic.tags
      })
    end
  end
end

topic = Discourse::Topic.new
topic.title="34 Provide a URL from a remote system to associate a forum topic with that URL, typically for using"
topic.body="Provide an external_id from a remote system to associate a forum topic with that id."
topic.tags=["tag-a","tag-b"]
topic.category_id=16
response = Discourse::TopicCreator.create(topic)
puts response
