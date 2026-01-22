class AddLlmSettingsToTranslation < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :llm_settings, :jsonb
  end
end
