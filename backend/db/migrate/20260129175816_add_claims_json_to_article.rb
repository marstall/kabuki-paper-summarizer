class AddClaimsJsonToArticle < ActiveRecord::Migration[8.1]
  def change
    add_column :articles, :claims, :jsonb
  end
end
