# frozen_string_literal: true
require 'axlsx'
require 'fileutils'

class Gradebook < ApplicationRecord
  belongs_to :klass
  has_many :earned_grades, -> {includes :grading_scale_grade}

  def calculate_final_grades
    klass_activity_types = self.klass.klass_activity_types

    user_grades = {}
    non_zero_earned_grades = self.earned_grades.select {|eg| eg.grading_scale_grade.value > 0 ? eg : nil }
    grouped_by_user = non_zero_earned_grades.group_by {|i| i.user_id}
    grouped_by_user.each do |key, earned_grades|
      activity_grades = earned_grades.map {|eg| {:activity_type => eg.homework.activity_type.id, :grade_value => eg.grading_scale_grade.value }}
      grouped_by_activity_type = activity_grades.group_by {|ag| ag[:activity_type]}
      grouped_by_user_activity_type = grouped_by_activity_type.map {|k,v| [k, v.map {|grade_obj| grade_obj[:grade_value]}]}.to_h
      user_grades[key] = grouped_by_user_activity_type.map {|user_id, grades| [user_id, grades.reduce(:+) / grades.length] }.to_h
    end
    
    activity_type_percentages = self.klass.klass_activity_types.map {|kat| [kat.activity_type_id, kat.percentage]}.to_h
    user_grades.each do |user_id, grades|
      final_grade = 0
      activity_type_percentages.each do |activity_type_id, percentage|
        if grades.has_key? activity_type_id
          final_grade = final_grade + percentage * grades[activity_type_id] / 100.0
        end
      end

      grades[:final] = final_grade.round(2)
    end

    user_grades
  end


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
