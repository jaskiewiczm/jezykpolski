# frozen_string_literal: true

class UserKlass < ApplicationRecord
  belongs_to :user
  belongs_to :klass
end
