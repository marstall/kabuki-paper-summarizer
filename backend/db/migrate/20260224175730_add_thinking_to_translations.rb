class AddThinkingToTranslations < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :thinking, :string
  end
end
