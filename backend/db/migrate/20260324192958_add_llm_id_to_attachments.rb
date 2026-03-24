class AddLlmIdToAttachments < ActiveRecord::Migration[8.1]
  def change
    add_column :attachments, :llm_id, :bigint
  end
end
