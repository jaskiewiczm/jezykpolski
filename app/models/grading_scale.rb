# frozen_string_literal: true

class GradingScale < ApplicationRecord
  has_many :grading_scale_grades
end
