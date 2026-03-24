class AddComponentFieldsToAttachments < ActiveRecord::Migration[8.1]
  def change
    add_column :attachments, :type, :string
    add_column :attachments, :component, :string
    add_column :attachments, :params, :jsonb
  end
end
