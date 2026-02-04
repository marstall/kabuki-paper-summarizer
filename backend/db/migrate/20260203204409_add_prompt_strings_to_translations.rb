class AddPromptStringsToTranslations < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :prompt1, :string
    add_column :translations, :prompt2, :string
    add_column :translations, :prompt3, :string
  end
end
