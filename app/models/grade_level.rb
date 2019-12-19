# frozen_string_literal: true

class GradeLevel < ApplicationRecord
  has_many :users
end
