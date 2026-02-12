class AddDefinitionsToTranslations < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :definitions, :jsonb
  end
end
