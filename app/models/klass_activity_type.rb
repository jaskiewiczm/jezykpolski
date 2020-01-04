# frozen_string_literal: true

class KlassActivityType < ApplicationRecord
  belongs_to :activity_type
  belongs_to :klass
end
