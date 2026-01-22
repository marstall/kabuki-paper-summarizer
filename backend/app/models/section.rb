class Section < ApplicationRecord
  belongs_to :article
  has_many :paragraphs
end
