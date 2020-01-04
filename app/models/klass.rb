# frozen_string_literal: true
require 'axlsx'

class Klass < ApplicationRecord
  has_many :calendar_entries
  has_many :user_klasses
  #has_many :users, -> { where(soft_unenrolled: 0) }, :through => :user_klasses
  has_many :users, :through => :user_klasses do
   def active
     where("user_klasses.soft_unenrolled = ?", 0)
   end
  end
  has_many :documents
  has_many :klass_activity_types
  has_many :activity_types, :through => :klass_activity_types
  has_one :gradebook
  has_many :homeworks
  belongs_to :teacher, :foreign_key => 'teacher_id', :class_name => :User

  def initialize(args)
    super(args)
    save!

    @gradebook = Gradebook.new
    @gradebook.klass_id = self.id
    @gradebook.save!

    acts = ActivityType.all
    acts.each do |act|
      @activity_types.append(act)
    end
  end

  def enrollment_to_excel_file()

    p = Axlsx::Package.new
    p.workbook.add_worksheet(:name => self.name) do |sheet|
      sheet.add_row [self.name + ' Enrollment']
      self.users.each do |user|
        sheet.add_row [user.name]
      end
    end

    dir = 'public/downloads/' + SecureRandom.uuid + '/'
    FileUtils.mkdir_p(dir)
    filepath = dir + self.klass.name + '_Gradebook.xlsx'
    p.serialize(filepath)
    return filepath
  end

  def get_klass_grade
    values = []
    gradebook.earned_grades.each do |earned_grade|
      values.append(earned_grade.grading_scale_grade.value)
    end

    if values.length > 0
      return values.reduce(:+) / values.size.to_f
    else
      0
    end
  end
end
