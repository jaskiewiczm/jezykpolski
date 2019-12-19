# frozen_string_literal: true

class Bill < ApplicationRecord
  belongs_to :user
  belongs_to :meta_bill
  has_many :user_rate_adjustments
  has_many :rate_adjustments, :through => :user_rate_adjustments

  def total
    default_rate = meta_bill.amount

    rate_adjustments.each do |ra|
      default_rate += ra.delta
    end

    default_rate
  end

  def paid?
    if self.paid_amount.nil?
      false
    else
      self.total <= self.paid_amount
    end
  end
end
