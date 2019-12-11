# frozen_string_literal: true

class EarnedGrade < ApplicationRecord
  belongs_to :gradebook
  belongs_to :user
  belongs_to :homework
  belongs_to :grading_scale_grade
  has_many :jezyk_polski_email, as: :emailable

  def get_earned_grade_posted_email
    {to: nil,
     from: 'no-reply@jezykpol.ski',
     subject: "New Grade for #{user.name}",
     body: "A new grade has been posted for #{user.name} in #{gradebook.klass.name}."
    }
  end
end
