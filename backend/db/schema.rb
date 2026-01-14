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

ActiveRecord::Schema[8.1].define(version: 2026_01_14_201858) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "uuid-ossp"

  create_table "articles", force: :cascade do |t|
    t.string "attribution"
    t.datetime "created_at", null: false
    t.string "full_text"
    t.string "generated_title"
    t.string "original_title"
    t.datetime "updated_at", null: false
    t.string "url"
    t.integer "year"
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

  create_table "revenue", id: false, force: :cascade do |t|
    t.string "month", limit: 4, null: false
    t.integer "revenue", null: false

    t.unique_constraint ["month"], name: "revenue_month_key"
  end

  create_table "users", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.text "email", null: false
    t.string "name", limit: 255, null: false
    t.text "password", null: false

    t.unique_constraint ["email"], name: "users_email_key"
  end
end
