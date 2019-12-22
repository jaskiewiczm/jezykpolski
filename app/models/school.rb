# frozen_string_literal: true

class School < ApplicationRecord
  has_many :klasses
  has_many :users
end
