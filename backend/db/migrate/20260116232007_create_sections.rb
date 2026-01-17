class CreateSections < ActiveRecord::Migration[8.1]
  def change
    create_table :sections do |t|
      t.references :article, null: false, foreign_key: true
      t.string :title

      t.timestamps
    end
  end
end
