# frozen_string_literal: true

require "openai"

module Config
  def Config.openai_client
    @open_ai_client||=OpenAI::Client.new
  end
end

