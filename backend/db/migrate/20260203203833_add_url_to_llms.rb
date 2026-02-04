class AddUrlToLlms < ActiveRecord::Migration[8.1]
  def change
    add_column :llms, :url, :string
  end
end
