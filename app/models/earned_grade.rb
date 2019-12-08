# frozen_string_literal: true

class EarnedGrade < ApplicationRecord
  belongs_to :gradebook
  belongs_to :user
  belongs_to :homework
  belongs_to :grading_scale_grade
  has_one :email, as: :emailable
end
