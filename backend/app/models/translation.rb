class Translation < ApplicationRecord
  belongs_to :paragraph
  belongs_to :llm
  belongs_to :prompt
end
