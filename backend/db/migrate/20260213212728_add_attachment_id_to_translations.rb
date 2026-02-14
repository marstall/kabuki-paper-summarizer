class AddAttachmentIdToTranslations < ActiveRecord::Migration[8.1]
  def change
    add_column :translations, :attachment_id, :integer
  end
end
