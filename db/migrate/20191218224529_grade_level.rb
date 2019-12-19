class GradeLevel < ActiveRecord::Migration[5.2]
  def up
    create_table :grade_levels, force: true do |t|
      t.string :level
      t.integer :level_integer
      t.timestamps
    end

    add_column :users, :grade_level_id, :bigint
    add_foreign_key :users, :grade_levels, column: :grade_level_id, primary_key: 'id'
  end

  def down
    drop_table :grade_levels
  end
end
