# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_02_17_235057) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "uuid-ossp"

  create_table "articles", force: :cascade do |t|
    t.string "attribution"
    t.jsonb "claims"
    t.datetime "created_at", null: false
    t.string "full_text"
    t.string "generated_title"
    t.string "original_title"
    t.datetime "updated_at", null: false
    t.string "url"
    t.integer "year"
  end

  create_table "attachments", force: :cascade do |t|
    t.string "alt_text"
    t.integer "article_id"
    t.binary "bytes"
    t.string "caption"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.integer "height"
    t.integer "size"
    t.string "string"
    t.datetime "updated_at", null: false
    t.integer "width"
  end

  create_table "customers", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "email", limit: 255, null: false
    t.string "image_url", limit: 255, null: false
    t.string "name", limit: 255, null: false
  end

  create_table "invoices", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.integer "amount", null: false
    t.uuid "customer_id", null: false
    t.date "date", null: false
    t.string "status", limit: 255, null: false
  end

  create_table "llms", force: :cascade do |t|
    t.string "api_key"
    t.datetime "created_at", null: false
    t.string "model"
    t.string "provider"
    t.string "secret_key"
    t.string "settings"
    t.string "type"
    t.datetime "updated_at", null: false
    t.string "url"
    t.string "version"
  end

  create_table "paragraphs", force: :cascade do |t|
    t.string "body"
    t.datetime "created_at", null: false
    t.bigint "section_id", null: false
    t.string "status"
    t.string "title"
    t.datetime "updated_at", null: false
    t.index ["section_id"], name: "index_paragraphs_on_section_id"
  end

  create_table "prompts", force: :cascade do |t|
    t.string "body"
    t.datetime "created_at", null: false
    t.string "title"
    t.datetime "updated_at", null: false
  end

  create_table "revenue", id: false, force: :cascade do |t|
    t.string "month", limit: 4, null: false
    t.integer "revenue", null: false

    t.unique_constraint ["month"], name: "revenue_month_key"
  end

  create_table "sections", force: :cascade do |t|
    t.bigint "article_id", null: false
    t.datetime "created_at", null: false
    t.string "title"
    t.datetime "updated_at", null: false
    t.index ["article_id"], name: "index_sections_on_article_id"
  end

  create_table "translations", force: :cascade do |t|
    t.integer "article_id"
    t.integer "attachment_id"
    t.string "body"
    t.string "category"
    t.jsonb "claims"
    t.datetime "created_at", null: false
    t.jsonb "definitions"
    t.string "extra_prompt"
    t.string "generation_note"
    t.bigint "llm_id"
    t.jsonb "llm_settings"
    t.integer "paragraph_id"
    t.string "prompt1"
    t.string "prompt2"
    t.string "prompt3"
    t.bigint "prompt_id"
    t.string "pull_quote"
    t.integer "pull_quote_index"
    t.string "second_title"
    t.string "status"
    t.string "string"
    t.json "subheaders"
    t.string "title"
    t.datetime "updated_at", null: false
    t.index ["llm_id"], name: "index_translations_on_llm_id"
    t.index ["prompt_id"], name: "index_translations_on_prompt_id"
  end

  create_table "users", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.text "email", null: false
    t.string "name", limit: 255, null: false
    t.text "password", null: false

    t.unique_constraint ["email"], name: "users_email_key"
  end

  add_foreign_key "paragraphs", "sections"
  add_foreign_key "sections", "articles"
  add_foreign_key "translations", "llms"
  add_foreign_key "translations", "prompts"
end
