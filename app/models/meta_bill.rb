# frozen_string_literal: true

class MetaBill < ApplicationRecord
  has_many :bills
  belongs_to :school

  has_many :meta_bill_rate_adjustments
  has_many :rate_adjustments, :through => :meta_bill_rate_adjustments

end
