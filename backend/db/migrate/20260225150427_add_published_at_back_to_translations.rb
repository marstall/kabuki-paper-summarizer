class AddPublishedAtBackToTranslations < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :published_at, :timestamp
  end
end
