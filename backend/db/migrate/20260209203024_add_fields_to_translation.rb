class AddFieldsToTranslation < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :category, :string
    add_column :translations, :pull_quote, :string
    add_column :translations, :pull_quote_index, :integer
    add_column :translations, :definitions, :string
    add_column :translations, :jsonb, :string
  end
end
