# frozen_string_literal: true

class Homework < ApplicationRecord
  has_many :earned_grades
  has_one :klass
end
