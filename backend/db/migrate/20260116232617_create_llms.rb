class CreateLlms < ActiveRecord::Migration[8.1]
  def change
    create_table :llms do |t|
      t.string :provider
      t.string :version
      t.string :settings
      t.string :api_key
      t.string :secret_key

      t.timestamps
    end
  end
end
