# frozen_string_literal: true
require 'singleton'
require 'json'

module Discourse
  class Client
    include Singleton
    attr_accessor :host

    def discourse_base_url
      url = ENV['DISCOURSE_BASE_URL']

      return url.end_with?("/") ? url.chop : url
    end

    def apiKey
      ENV['DISCOURSE_API_KEY']
    end

    def apiUsername
      ENV['DISCOURSE_API_USERNAME']
    end

    def url(path)
      path = path.start_with?("/") ? path[1..-1] : path
      discourse_base_url + "/" + path
    end

    def get(path)
      response = HTTParty.get(url(path),headers:
        {
          'Api-Key'=> apiKey,
          'Api-Username'=>apiUsername
        }
      )
    end

    def post(path,params)
      headers = {
        'Api-Key'=> apiKey,
        'Api-Username'=>apiUsername
      }
      response = HTTParty.post(url(path), {body:params, headers:headers})
      puts response
    end

  end
end
