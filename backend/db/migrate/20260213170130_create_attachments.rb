class CreateAttachments < ActiveRecord::Migration[8.1]
  def change
    create_table :attachments do |t|
      t.binary :bytes
      t.string :caption
      t.integer :article_id
      t.string :content_type

      t.timestamps
    end
  end
end
