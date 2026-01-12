# frozen_string_literal: true
require 'httparty'
require 'json'
require 'random_word'

require "./discourse/client.rb"

module Discourse
  class Category

    def Category.create
      client = Client.instance
      name = RandomWord.adjs.next
      puts "creating category #{name} ..."
      response = client.post("/categories.json", {
        "name": name,
        "parent_category_id": 7,
        "permissions": {
          "staff": 1
        }
      })
      parsed = JSON.parse(response.body)
      parsed.dig("category", "id")
    end
  end
end

id = Discourse::Category.create

puts id
