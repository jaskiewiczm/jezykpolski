# frozen_string_literal: true

class Klass < ApplicationRecord
  has_many :calendar_entries
  has_many :user_klasses
  has_many :users, :through => :user_klasses
  has_many :documents
  has_one :gradebook
  has_many :homeworks

  def initialize(args)
    super(args)
    save!

    @gradebook = Gradebook.new
    @gradebook.klass_id = self.id
    @gradebook.save!

  end
end
