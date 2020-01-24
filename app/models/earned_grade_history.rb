# frozen_string_literal: true

class EarnedGradeHistory < ApplicationRecord
  belongs_to :earned_grade  
  belongs_to :grading_scale_grade
  belongs_to :teacher, :foreign_key => 'teacher_id', :class_name => :User
end
