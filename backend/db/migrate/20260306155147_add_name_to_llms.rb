class AddNameToLlms < ActiveRecord::Migration[8.1]
  def change
    add_column :llms, :name, :string
  end
end
