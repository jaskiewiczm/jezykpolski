# frozen_string_literal: true

class RateAdjustment < ApplicationRecord
  has_many :bills, :through => :user_rate_adjustments
end
