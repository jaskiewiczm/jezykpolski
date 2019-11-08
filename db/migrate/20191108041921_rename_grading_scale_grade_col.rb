class RenameGradingScaleGradeCol < ActiveRecord::Migration[5.2]
  def change
    rename_column :earned_grades, :grading_scale_grades, :grading_scale_grade_id
  end
end
