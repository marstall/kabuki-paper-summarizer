class AddTitleFieldsToArticle < ActiveRecord::Migration[8.1]
  def change
    add_column :articles, :title, :string
    add_column :articles, :second_title, :string
    add_column :articles, :category, :string
  end
end
