# frozen_string_literal: true

class Homework < ApplicationRecord
  has_many :earned_grades
  belongs_to :klass
end
