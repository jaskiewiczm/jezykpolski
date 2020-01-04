# frozen_string_literal: true

class ActivityType < ApplicationRecord
  has_many :klass_activity_types
end
