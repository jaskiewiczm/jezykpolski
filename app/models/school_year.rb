# frozen_string_literal: true

class SchoolYear < ApplicationRecord
  has_many :bills
  has_one :school
end
