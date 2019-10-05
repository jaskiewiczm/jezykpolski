# frozen_string_literal: true

class ReadingLog < ActiveRecord::Migration[5.2]
  def up
    create_table 'books', force: true do |t|
      t.string 'title'
      t.string 'author'
      t.timestamps
    end

    create_table 'reading_logs', force: true do |t|
      t.integer 'user_id'
      t.integer 'book_id'
      t.integer 'duration'
      t.timestamps
    end
  end
end
