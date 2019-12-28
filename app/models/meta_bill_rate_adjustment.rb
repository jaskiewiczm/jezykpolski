# frozen_string_literal: true

class MetaBillRateAdjustment < ApplicationRecord
  belongs_to :meta_bill
  belongs_to :rate_adjustment
end
