# frozen_string_literal: true
require 'axlsx'
require 'fileutils'

class Gradebook < ApplicationRecord
  belongs_to :klass
  has_many :earned_grades

  def gradebook_to_excel_file
    users = self.klass.users.order(:name)
    homeworks = self.klass.homeworks.order(:due_date)
    grading_scale = GradingScale.where('name = ?', 'Basic').first
    earned_grades = self.earned_grades

    p = Axlsx::Package.new
    p.workbook.add_worksheet(:name => self.klass.name) do |sheet|

      homework_date_array = homeworks.map {|homework| homework.due_date }
      homework_date_array.unshift('')
      sheet.add_row homework_date_array

      homework_title_array = homeworks.map {|homework| homework.title }
      homework_title_array.unshift('')
      sheet.add_row homework_title_array

      users.each do |user|
        user_array_grade_name = [user.name]
        user_array_grade_value = ['']

        homeworks.each do |homework|
          earned_grade = earned_grades.where('user_id = ? and homework_id = ?', user.id, homework.id).first
          if earned_grade.nil?
            user_array_grade_name.append('N/A')
            user_array_grade_value.append('')
          else
            user_array_grade_name.append(earned_grade.grading_scale_grade.name)
            user_array_grade_value.append(earned_grade.grading_scale_grade.value)
          end
        end

        sheet.add_row user_array_grade_name
        sheet.add_row user_array_grade_value
      end

    end

    dir = 'public/downloads/' + SecureRandom.uuid + '/'
    FileUtils.mkdir_p(dir)
    filepath = dir + self.klass.name + '_Gradebook.xlsx'
    p.serialize(filepath)
    return filepath
  end
end
