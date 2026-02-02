class Article < ApplicationRecord
  has_many :sections
  has_many :translations
end
