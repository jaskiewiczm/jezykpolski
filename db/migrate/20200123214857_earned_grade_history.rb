class EarnedGradeHistory < ActiveRecord::Migration[5.2]
  def up
  	create_table :earned_grade_histories, force: true do |t|
      t.bigint :earned_grade_id
      t.bigint :teacher_id
      t.bigint :grading_scale_grade_id
      t.timestamps
    end

    add_foreign_key :earned_grade_histories, :users, column: :teacher_id, primary_key: 'id'
    add_foreign_key :earned_grade_histories, :earned_grades, column: :earned_grade_id, primary_key: 'id'
    add_foreign_key :earned_grade_histories, :grading_scale_grades, column: :grading_scale_grade_id, primary_key: 'id'
  end

  def down
  	drop_table :earned_grade_histories
  end
end
