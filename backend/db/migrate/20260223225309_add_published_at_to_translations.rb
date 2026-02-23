class AddPublishedAtToTranslations < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :published_at, :string
    add_column :translations, :timestamp, :string
  end
end
