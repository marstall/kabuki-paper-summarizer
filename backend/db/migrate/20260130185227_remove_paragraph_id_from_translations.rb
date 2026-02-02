class RemoveParagraphIdFromTranslations < ActiveRecord::Migration[8.1]
  def change
    remove_column :translations, :paragraph_id, :bigint
  end
end
