class Homework < ActiveRecord::Migration[5.2]
  def change
    create_table 'homeworks', force: true do |t|
      t.date 'due_date'
      t.string 'description'
      t.timestamps
    end
  end
end
