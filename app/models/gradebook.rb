# frozen_string_literal: true
require 'axlsx'
require 'fileutils'

class Gradebook < ApplicationRecord
  belongs_to :klass
  has_many :earned_grades, -> {includes :grading_scale_grade}

  def calculate_final_grades_distribution(user_id)
    user_grades = self.calculate_final_grades
    user_grade = user_grades[user_id].dup

    user_grades.each {|key, value| value.delete(:final_letter)}
    activity_type_ids = user_grades.values.map {|item| item.keys}
    activity_type_ids = activity_type_ids.flatten.uniq    
    
    added_raw_values = {}
    count_raw_values = {}
    activity_type_ids.each {|at_id| added_raw_values[at_id] = 0 }
    activity_type_ids.each {|at_id| count_raw_values[at_id] = 0 }

    activity_type_ids.each do |at_id|
      user_grades.values.each do |user_grade|
        if user_grade.has_key? at_id
          if at_id == :final
            added_raw_values[at_id] += user_grade[at_id] 
          else 
            added_raw_values[at_id] += user_grade[at_id][:raw_value] 
          end
          
          count_raw_values[at_id] += 1
        end
      end
    end

    gs = GradingScale.includes(:grading_scale_grades).where(:name => 'Basic').first

    calculated = activity_type_ids.map {|at_id| {at_id => gs.get_letter_grade_for_value(added_raw_values[at_id] / count_raw_values[at_id]) }}    
    calculated = calculated.reduce({}, :merge)
    {class_grades: calculated, user_grades: user_grade}
  end

  def calculate_final_grades
    gs = GradingScale.includes(:grading_scale_grades).where(:name => 'Basic').first
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
          #grades[ActivityType.find_by_id(activity_type_id).code.to_sym] = grades[activity_type_id]
          
          activity_grade = grades[activity_type_id]
          grades.delete(activity_type_id)
          grades[activity_type_id] = {
            raw_value: activity_grade,
            letter_value: gs.get_letter_grade_for_value(activity_grade)
          }
        end
      end

      grades[:final] = final_grade.round(2)
      grades[:final_letter] = gs.get_letter_grade_for_value grades[:final]
    end

    active_user_ids = self.klass.users.active.map {|user| user.id}
    (user_grades.keys - active_user_ids).each {|bad_id| user_grades.delete bad_id}

    user_grades
  end


  def gradebook_to_excel_file    
    users = self.klass.users.active.order(:name)
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
