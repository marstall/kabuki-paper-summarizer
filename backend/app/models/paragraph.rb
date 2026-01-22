class Paragraph < ApplicationRecord
  belongs_to :section
  has_many :translations
end
