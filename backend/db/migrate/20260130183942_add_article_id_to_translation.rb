class AddArticleIdToTranslation < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :article_id, :integer
  end
end
