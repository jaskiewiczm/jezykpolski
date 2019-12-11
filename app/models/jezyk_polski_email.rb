# frozen_string_literal: true

class JezykPolskiEmail < ApplicationRecord
  belongs_to :emailable, polymorphic: true

  def earned_grade
    emailable if emailable_type == 'EarnedGrade'
  end

  def send_email(email_obj)
    SendGridHelper.delay.send_email(email_obj)
    self.sent_at = DateTime.now
    self.save!
  end
end