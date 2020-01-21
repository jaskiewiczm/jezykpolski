# frozen_string_literal: true

class GradingScale < ApplicationRecord
  has_many :grading_scale_grades

  def get_letter_grade_for_value(value)
  	letter_grade = nil

  	grading_scale_grades.each do |grade|
  		if grade.lower_bound_inclusive <= value && value < grade.upper_bound_exclusive
  			letter_grade = grade.name
  			break
  		end
  	end

  	letter_grade
  end
end
