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

ActiveRecord::Schema[8.1].define(version: 2026_07_17_100338) do
  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "bookings", force: :cascade do |t|
    t.integer "conservation_fee_cents"
    t.datetime "created_at", null: false
    t.text "extras"
    t.text "gear_selections"
    t.string "guest_email"
    t.string "guest_name"
    t.string "guest_phone"
    t.integer "status"
    t.string "stripe_payment_intent_id"
    t.integer "total_cents"
    t.integer "trip_id", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.index ["trip_id"], name: "index_bookings_on_trip_id"
    t.index ["user_id"], name: "index_bookings_on_user_id"
  end

  create_table "conservation_events", force: :cascade do |t|
    t.integer "capacity"
    t.datetime "created_at", null: false
    t.date "date"
    t.text "description"
    t.integer "event_type"
    t.string "location"
    t.string "title"
    t.datetime "updated_at", null: false
  end

  create_table "course_enrollments", force: :cascade do |t|
    t.integer "balance_due_cents"
    t.integer "course_id", null: false
    t.datetime "created_at", null: false
    t.integer "deposit_paid_cents"
    t.integer "status"
    t.string "stripe_balance_intent_id"
    t.string "stripe_payment_intent_id"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["course_id"], name: "index_course_enrollments_on_course_id"
    t.index ["user_id"], name: "index_course_enrollments_on_user_id"
  end

  create_table "courses", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "duration_days"
    t.integer "level"
    t.integer "price_cents"
    t.string "title"
    t.datetime "updated_at", null: false
  end

  create_table "dive_sites", id: :string, force: :cascade do |t|
    t.text "best_months"
    t.string "country"
    t.datetime "created_at", null: false
    t.string "current_strength"
    t.integer "depth_max"
    t.integer "depth_min"
    t.text "description"
    t.string "difficulty"
    t.text "features"
    t.string "image_url"
    t.float "lat"
    t.float "lng"
    t.string "location"
    t.text "marine_life"
    t.string "name"
    t.float "rating"
    t.integer "reviews"
    t.integer "temperature_max"
    t.integer "temperature_min"
    t.datetime "updated_at", null: false
    t.integer "visibility_max"
    t.integer "visibility_min"
  end

  create_table "impact_stats", force: :cascade do |t|
    t.integer "co2_offset_kg"
    t.integer "conservation_fund_cents"
    t.integer "coral_fragments_planted"
    t.datetime "created_at", null: false
    t.integer "marine_animals_tagged"
    t.datetime "updated_at", null: false
  end

  create_table "log_entries", force: :cascade do |t|
    t.integer "booking_id"
    t.datetime "created_at", null: false
    t.date "date"
    t.integer "depth"
    t.integer "duration"
    t.text "highlights"
    t.string "site_name"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.integer "visibility"
    t.integer "water_temp"
    t.index ["booking_id"], name: "index_log_entries_on_booking_id"
    t.index ["user_id"], name: "index_log_entries_on_user_id"
  end

  create_table "rsvps", force: :cascade do |t|
    t.boolean "attended", default: false, null: false
    t.integer "conservation_event_id", null: false
    t.datetime "created_at", null: false
    t.string "guest_email"
    t.string "guest_name"
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.index ["conservation_event_id"], name: "index_rsvps_on_conservation_event_id"
    t.index ["user_id"], name: "index_rsvps_on_user_id"
  end

  create_table "trips", force: :cascade do |t|
    t.integer "capacity"
    t.datetime "created_at", null: false
    t.date "date"
    t.string "departure_time"
    t.string "dive_site_id", null: false
    t.integer "required_cert_level"
    t.datetime "updated_at", null: false
    t.index ["dive_site_id"], name: "index_trips_on_dive_site_id"
  end

  create_table "users", force: :cascade do |t|
    t.boolean "cert_verified_by_staff", default: false, null: false
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "jti", null: false
    t.string "name"
    t.integer "padi_cert_level"
    t.string "padi_cert_number"
    t.string "phone"
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.integer "role", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "bookings", "trips"
  add_foreign_key "bookings", "users"
  add_foreign_key "course_enrollments", "courses"
  add_foreign_key "course_enrollments", "users"
  add_foreign_key "log_entries", "bookings"
  add_foreign_key "log_entries", "users"
  add_foreign_key "rsvps", "conservation_events"
  add_foreign_key "rsvps", "users"
  add_foreign_key "trips", "dive_sites"
end
