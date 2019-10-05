# frozen_string_literal: true

class Calendar < ActiveRecord::Migration[5.2]
  def up
    create_table 'klasses', force: true do |t|
      t.string 'name'
      t.timestamps
    end

    create_table 'calendar_entries', force: true do |t|
      t.string 'assignment_text'
      t.date 'date'
      t.integer 'klass_id'
      t.timestamps
    end

    create_table 'user_klasses', force: true do |t|
      t.integer :user_id
      t.integer :klass_id
      t.timestamps
    end
  end
end
