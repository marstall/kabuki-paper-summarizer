class DropPublishedAtAndTimestampFromTranslations < ActiveRecord::Migration[8.1]
  def up
    remove_column :translations, :published_at, :string
    remove_column :translations, :timestamp, :string
  end

  def down
    add_column :translations, :published_at, :string
    add_column :translations, :timestamp, :string
  end
end
