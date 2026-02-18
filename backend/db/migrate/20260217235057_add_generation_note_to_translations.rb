class AddGenerationNoteToTranslations < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :generation_note, :string
  end
end
