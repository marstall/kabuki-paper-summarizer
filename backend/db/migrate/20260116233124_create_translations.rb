class CreateTranslations < ActiveRecord::Migration[8.1]
  def change
    create_table :translations do |t|
      t.references :paragraph, null: false, foreign_key: true
      t.references :llm, null: false, foreign_key: true
      t.references :prompt, null: false, foreign_key: true
      t.string :title
      t.string :body
      t.string :extra_prompt
      t.string :status

      t.timestamps
    end
  end
end
