# frozen_string_literal: true

class BillMetaBill < ApplicationRecord
  belongs_to :bill
  belongs_to :meta_bill
end
