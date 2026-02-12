class AddSubheadersToTranslations < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :subheaders, :json
  end
end
