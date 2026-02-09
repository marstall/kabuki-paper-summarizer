class AddModelToLlm < ActiveRecord::Migration[8.1]
  def change
    add_column :llms, :model, :string
  end
end
