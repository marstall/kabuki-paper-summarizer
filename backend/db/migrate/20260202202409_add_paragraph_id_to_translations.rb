class AddParagraphIdToTranslations < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :paragraph_id, :integer
  end
end
