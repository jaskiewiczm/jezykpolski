# frozen_string_literal: true

class JezykPolskiEmail < ApplicationRecord
  belongs_to :emailable, polymorphic: true

  scope :unsent_and_unscheduled, -> { where("completed_at is null and scheduled_at is null")}

  def earned_grade
    emailable if emailable_type == 'EarnedGrade'
  end

  def send_email(email_obj)
    user_id = self.emailable&.user_id
    if user_id.present?
      last_4_hour_user_ids = JezykPolskiEmail.where(completed_at: (Time.now - 4.hours)..Time.now)
                                             .map(&:earned_grade)
                                             .map(&:user_id)
                                             .uniq
      if last_4_hour_user_ids.exclude? user_id
        sendgrid_body, status_code = SendGridHelper.send_email(email_obj)
        status_code = status_code.to_i
        if status_code == 401
          self.response_body = sendgrid_body
        end
        self.response_status_code = status_code
      end
      self.completed_at = DateTime.now
      self.save!
    else
      raise ArgumentError.new('User_id is missing on this emailable record.')
    end
  end
end