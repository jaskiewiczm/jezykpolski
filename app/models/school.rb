# frozen_string_literal: true

class School < ApplicationRecord
  has_many :klasses
  has_many :users
  has_many :meta_bills
  belongs_to :active_period, class_name: :SchoolPeriod
end
