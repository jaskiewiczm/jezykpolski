# frozen_string_literal: true

class Klass < ApplicationRecord
  has_many :calendar_entries
  has_many :users
  has_many :documents
end
