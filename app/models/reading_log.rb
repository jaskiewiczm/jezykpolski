# frozen_string_literal: true

class ReadingLog < ApplicationRecord
  belongs_to :user
  belongs_to :book
end
