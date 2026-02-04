class AddClaimsToTranslations < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :claims, :jsonb
  end
end
