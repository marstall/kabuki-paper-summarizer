class AddDimensionsToAttachments < ActiveRecord::Migration[8.1]
  def change
    add_column :attachments, :width, :integer
    add_column :attachments, :height, :integer
    add_column :attachments, :size, :integer
  end
end
