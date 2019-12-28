# frozen_string_literal: true

class RateAdjustment < ApplicationRecord
  has_many :bills, :through => :user_rate_adjustments
  has_many :meta_bills, :through => :meta_bill_rate_adjustments
end
