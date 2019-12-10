# frozen_string_literal: true

class JezykPolskiEmail < ApplicationRecord
  belongs_to :emailable, polymorphic: true

  def earned_grade
    emailable if emailable_type == 'EarnedGrade'
  end
end