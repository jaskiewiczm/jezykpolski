# frozen_string_literal: true

class Bill < ApplicationRecord
  belongs_to :user
  has_many :bill_meta_bills
  has_many :meta_bills, :through => :bill_meta_bills

  def total
    amounts = self.meta_bills.map {|mb| mb.amount}
    return amounts.inject(0, :+)
  end
end
