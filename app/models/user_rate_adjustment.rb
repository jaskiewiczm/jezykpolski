# frozen_string_literal: true

class UserRateAdjustment < ApplicationRecord
  belongs_to :bill
  belongs_to :rate_adjustment
end
