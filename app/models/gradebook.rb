# frozen_string_literal: true

class Gradebook < ApplicationRecord
  belongs_to :klass
  has_many :earned_grades
end
