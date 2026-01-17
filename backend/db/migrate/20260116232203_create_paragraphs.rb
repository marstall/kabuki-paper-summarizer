class CreateParagraphs < ActiveRecord::Migration[8.1]
  def change
    create_table :paragraphs do |t|
      t.references :section, null: false, foreign_key: true
      t.string :title
      t.string :body
      t.string :status

      t.timestamps
    end
  end
end
