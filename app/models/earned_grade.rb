# frozen_string_literal: true

class EarnedGrade < ApplicationRecord
  belongs_to :gradebook
  belongs_to :user
  belongs_to :grading_scale_grade
end
