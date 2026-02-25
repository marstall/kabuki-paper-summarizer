class AddGenerationToTranslation < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :generation, :string
  end
end
