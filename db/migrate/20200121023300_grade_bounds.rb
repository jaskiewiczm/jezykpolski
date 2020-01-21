class GradeBounds < ActiveRecord::Migration[5.2]
  def up
  	rename_column :grading_scale_grades, :upper_bound_inclusive, :upper_bound_exclusive
  	change_column :grading_scale_grades, :lower_bound_inclusive, :float
  	change_column :grading_scale_grades, :upper_bound_exclusive, :float

  	val_na = GradingScaleGrade.find_by_id 6
  	val_na.lower_bound_inclusive = 0
  	val_na.upper_bound_exclusive = 0.1
  	val_na.save!
  	val_1 = GradingScaleGrade.find_by_id 1
  	val_1.lower_bound_inclusive = 0.11
  	val_1.upper_bound_exclusive = 1.75
  	val_1.save!
  	val_minus_2 = GradingScaleGrade.find_by_id 7
  	val_minus_2.lower_bound_inclusive = 1.75
  	val_minus_2.upper_bound_exclusive = 2
  	val_minus_2.save!
  	val_2 = GradingScaleGrade.find_by_id 2
  	val_2.lower_bound_inclusive = 2 
  	val_2.upper_bound_exclusive = 2.5
  	val_2.save!
  	val_plus_2 = GradingScaleGrade.find_by_id 8
  	val_plus_2.lower_bound_inclusive = 2.5
  	val_plus_2.upper_bound_exclusive = 2.75
  	val_plus_2.save!
  	val_minus_3 = GradingScaleGrade.find_by_id 9
  	val_minus_3.lower_bound_inclusive = 2.75
  	val_minus_3.upper_bound_exclusive = 3
  	val_minus_3.save!
  	val_3 = GradingScaleGrade.find_by_id 3
  	val_3.lower_bound_inclusive = 3
  	val_3.upper_bound_exclusive = 3.5
  	val_3.save!
  	val_plus_3 = GradingScaleGrade.find_by_id 10
  	val_plus_3.lower_bound_inclusive = 3.5
  	val_plus_3.upper_bound_exclusive = 3.75
  	val_plus_3.save!
  	val_minus_4 = GradingScaleGrade.find_by_id 11
  	val_minus_4.lower_bound_inclusive = 3.75
  	val_minus_4.upper_bound_exclusive = 4
  	val_minus_4.save!
  	val_4 = GradingScaleGrade.find_by_id 4
  	val_4.lower_bound_inclusive = 4
  	val_4.upper_bound_exclusive = 4.5
  	val_4.save!
  	val_plus_4 = GradingScaleGrade.find_by_id 12
  	val_plus_4.lower_bound_inclusive = 4.5
  	val_plus_4.upper_bound_exclusive = 4.75
  	val_plus_4.save!
  	val_minus_5 = GradingScaleGrade.find_by_id 13
  	val_minus_5.lower_bound_inclusive = 4.75
  	val_minus_5.upper_bound_exclusive = 5
  	val_minus_5.save!
  	val_5 = GradingScaleGrade.find_by_id 5
  	val_5.lower_bound_inclusive = 5
  	val_5.upper_bound_exclusive = 5.5
  	val_5.save!
  	val_plus_5 = GradingScaleGrade.find_by_id 14
  	val_plus_5.lower_bound_inclusive = 5.5
  	val_plus_5.upper_bound_exclusive = 6
  	val_plus_5.save!
  	val_6 = GradingScaleGrade.find_by_id 15
  	val_6.lower_bound_inclusive = 6
  	val_6.upper_bound_exclusive = 6
  	val_6.save!
  end

  def down
  	rename_column :grading_scale_grades, :upper_bound_exclusive, :upper_bound_inclusive
  end
end
