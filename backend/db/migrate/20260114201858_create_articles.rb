class CreateArticles < ActiveRecord::Migration[8.1]
  def change
    create_table :articles do |t|
      t.string :original_title
      t.string :generated_title
      t.integer :year
      t.string :attribution
      t.string :url
      t.string :full_text

      t.timestamps
    end
  end
end
