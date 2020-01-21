# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_01_06_014348) do

  create_table "activity_types", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "bill_meta_bills", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.bigint "bill_id"
    t.bigint "meta_bill_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bill_id"], name: "fk_rails_94e3455f44"
    t.index ["meta_bill_id"], name: "fk_rails_1723e26f44"
  end

  create_table "bills", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "paid_amount"
    t.boolean "soft_delete", default: false
    t.bigint "school_id"
    t.index ["school_id"], name: "fk_rails_5e2470764d"
    t.index ["user_id"], name: "fk_rails_f5fcc78f42"
  end

  create_table "books", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "title"
    t.string "author"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "calendar_entries", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "assignment_text"
    t.date "date"
    t.integer "klass_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "delayed_jobs", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "documents", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "name"
    t.integer "klass_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "earned_grades", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.integer "gradebook_id", null: false
    t.integer "user_id", null: false
    t.integer "grading_scale_grade_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "homework_id", null: false
  end

  create_table "grade_levels", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "level"
    t.integer "level_integer"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "gradebooks", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.integer "klass_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "grading_scale_grades", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "name", null: false
    t.float "value"
    t.integer "grading_scale_id"
    t.integer "order", null: false
    t.integer "lower_bound_inclusive"
    t.integer "upper_bound_inclusive"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "group"
    t.string "visualization_level"
  end

  create_table "grading_scales", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "homeworks", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.date "due_date"
    t.string "description", limit: 4096
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "klass_id"
    t.boolean "disabled", default: false
    t.string "title"
    t.bigint "activity_type_id"
    t.index ["activity_type_id"], name: "fk_rails_236e1f009c"
    t.index ["klass_id"], name: "fk_rails_be9153e8bc"
  end

  create_table "jezyk_polski_emails", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.bigint "emailable_id"
    t.string "emailable_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "completed_at"
    t.datetime "scheduled_at"
    t.integer "response_status_code"
    t.string "response_body"
  end

  create_table "klass_activity_types", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.float "percentage"
    t.bigint "klass_id"
    t.bigint "activity_type_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activity_type_id"], name: "fk_rails_9d0a954cc1"
    t.index ["klass_id"], name: "fk_rails_a14a1066d8"
  end

  create_table "klasses", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "school_id"
    t.bigint "teacher_id"
    t.index ["school_id"], name: "fk_rails_c5e5112d0b"
  end

  create_table "meta_bills", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.float "amount"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "school_id"
    t.boolean "soft_delete", default: false
    t.string "bill_type", default: "bill"
    t.index ["school_id"], name: "fk_rails_9ae6112ea3"
  end

  create_table "reading_logs", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.integer "user_id"
    t.integer "book_id"
    t.integer "duration"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "roles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "code"
    t.integer "sort"
  end

  create_table "school_periods", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "year_span"
    t.string "period_name"
    t.bigint "school_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["school_id"], name: "fk_rails_2110fb2914"
  end

  create_table "schools", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "active_period_id"
    t.index ["active_period_id"], name: "fk_rails_b6621e6ddf"
  end

  create_table "security_logs", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "error"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_klasses", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.integer "user_id"
    t.integer "klass_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "soft_unenrolled", default: 0
  end

  create_table "user_roles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.integer "user_id"
    t.integer "role_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.bigint "parent_id"
    t.bigint "child_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["child_id"], name: "fk_rails_9b9d9fe572"
    t.index ["parent_id"], name: "fk_rails_97d3981df2"
  end

  create_table "users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci", force: :cascade do |t|
    t.string "email", default: ""
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "parent_1_id"
    t.bigint "parent_2_id"
    t.string "name"
    t.bigint "school_id"
    t.bigint "grade_level_id"
    t.boolean "disabled", default: false
    t.boolean "suppress_grades_emails", default: false
    t.integer "sign_in_count", default: 0, null: false
    t.index ["email", "school_id"], name: "index_users_on_email_and_school_id", unique: true
    t.index ["grade_level_id"], name: "fk_rails_ddf8e43c6b"
    t.index ["name", "school_id"], name: "index_users_on_name_and_school_id", unique: true
    t.index ["parent_1_id"], name: "fk_rails_e17b45d8c8"
    t.index ["parent_2_id"], name: "fk_rails_f1d8d6e861"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "bill_meta_bills", "bills"
  add_foreign_key "bill_meta_bills", "meta_bills"
  add_foreign_key "bills", "schools"
  add_foreign_key "bills", "users"
  add_foreign_key "homeworks", "activity_types"
  add_foreign_key "homeworks", "klasses"
  add_foreign_key "klass_activity_types", "activity_types"
  add_foreign_key "klass_activity_types", "klasses"
  add_foreign_key "klasses", "schools"
  add_foreign_key "meta_bills", "schools"
  add_foreign_key "school_periods", "schools"
  add_foreign_key "schools", "school_periods", column: "active_period_id"
  add_foreign_key "user_users", "users", column: "child_id"
  add_foreign_key "user_users", "users", column: "parent_id"
  add_foreign_key "users", "grade_levels"
  add_foreign_key "users", "users", column: "parent_1_id"
  add_foreign_key "users", "users", column: "parent_2_id"
end
