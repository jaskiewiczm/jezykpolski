# frozen_string_literal: true

class Email < ApplicationRecord
  belongs_to :emailable, polymorphic: true
end