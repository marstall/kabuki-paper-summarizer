class MakeLlmAndPromptNullableOnTranslations < ActiveRecord::Migration[7.1]
  def change
    change_column_null :translations, :llm_id, true
    change_column_null :translations, :prompt_id, true
  end
end

