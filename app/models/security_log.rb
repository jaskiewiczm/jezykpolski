# frozen_string_literal: true

class SecurityLog < ApplicationRecord
  belongs_to :user
end
