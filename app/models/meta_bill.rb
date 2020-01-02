# frozen_string_literal: true

class MetaBill < ApplicationRecord
  has_many :bills
  belongs_to :school

end
