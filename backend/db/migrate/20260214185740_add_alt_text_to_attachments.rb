class AddAltTextToAttachments < ActiveRecord::Migration[8.1]
  def change
    add_column :attachments, :alt_text, :string
    add_column :attachments, :string, :string
  end
end
