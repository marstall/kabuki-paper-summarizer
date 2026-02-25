class AddForeignKeysForPrismaIntrospection < ActiveRecord::Migration[8.1]
  disable_ddl_transaction!

  def up
    # 1) attachments.article_id -> articles.id
    # Convert integer -> bigint to match articles.id bigint
    change_column :attachments, :article_id, :bigint, using: "article_id::bigint"
    add_index :attachments, :article_id, algorithm: :concurrently unless index_exists?(:attachments, :article_id)
    add_foreign_key :attachments, :articles, column: :article_id

    # 2) translations.article_id -> articles.id
    change_column :translations, :article_id, :bigint, using: "article_id::bigint"
    add_index :translations, :article_id, algorithm: :concurrently unless index_exists?(:translations, :article_id)
    add_foreign_key :translations, :articles, column: :article_id

    # 3) translations.attachment_id -> attachments.id
    change_column :translations, :attachment_id, :bigint, using: "attachment_id::bigint"
    add_index :translations, :attachment_id, algorithm: :concurrently unless index_exists?(:translations, :attachment_id)
    add_foreign_key :translations, :attachments, column: :attachment_id

    # 4) translations.paragraph_id -> paragraphs.id
    change_column :translations, :paragraph_id, :bigint, using: "paragraph_id::bigint"
    add_index :translations, :paragraph_id, algorithm: :concurrently unless index_exists?(:translations, :paragraph_id)
    add_foreign_key :translations, :paragraphs, column: :paragraph_id
  end

  def down
    # Reverse in safe order (drop FKs, then indexes, then type changes back if desired)
    remove_foreign_key :invoices, column: :customer_id if foreign_key_exists?(:invoices, column: :customer_id)
    remove_index :invoices, :customer_id if index_exists?(:invoices, :customer_id)

    remove_foreign_key :translations, column: :paragraph_id if foreign_key_exists?(:translations, column: :paragraph_id)
    remove_index :translations, :paragraph_id if index_exists?(:translations, :paragraph_id)

    remove_foreign_key :translations, column: :attachment_id if foreign_key_exists?(:translations, column: :attachment_id)
    remove_index :translations, :attachment_id if index_exists?(:translations, :attachment_id)

    remove_foreign_key :translations, column: :article_id if foreign_key_exists?(:translations, column: :article_id)
    remove_index :translations, :article_id if index_exists?(:translations, :article_id)

    remove_foreign_key :attachments, column: :article_id if foreign_key_exists?(:attachments, column: :article_id)
    remove_index :attachments, :article_id if index_exists?(:attachments, :article_id)

    # Optional: revert types back to integer (I typically would NOT do this)
    change_column :translations, :paragraph_id, :integer, using: "paragraph_id::integer"
    change_column :translations, :attachment_id, :integer, using: "attachment_id::integer"
    change_column :translations, :article_id, :integer, using: "article_id::integer"
    change_column :attachments, :article_id, :integer, using: "article_id::integer"
  end
end