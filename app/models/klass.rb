# frozen_string_literal: true
require 'axlsx'

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

  def enrollment_to_excel_file()

    p = Axlsx::Package.new
    p.workbook.add_worksheet(:name => self.name) do |sheet|
      sheet.add_row [self.name + ' Enrollment']
      self.users.each do |user|
        sheet.add_row [user.name]
      end
    end

    return p
  end
end
