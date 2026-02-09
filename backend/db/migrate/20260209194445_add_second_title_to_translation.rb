class AddSecondTitleToTranslation < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :second_title, :string
    add_column :translations, :string, :string
  end
end
