# frozen_string_literal: true

class UserReportsController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def get_class_homework_distributions
    user = User.find_by_id current_user.id

    klasses_array = []
    user.klasses.each do |klass|
      gradebook = klass.gradebook
      homeworks = Homework.where('klass_id = ?', klass.id).where(:disabled => false).order('due_date asc')
      homeworks.each do |homework|
        earned_grades = EarnedGrade.where({:homework_id => homework.id, :gradebook_id => gradebook.id})
                                   .group(:grading_scale_grade_id)
                                   .count

      end
    end
  end

  def _get_user_report(student_id)
    user = User.find_by_id student_id

    klasses_array = []
    user.klasses.each do |klass|
      gradebook = klass.gradebook
      klass_obj = klass.attributes
      klass_obj['homeworks'] = []

      homeworks = Homework.where('klass_id = ?', klass.id).where(:disabled => false).order('due_date asc')

      homeworks.each do |homework|
        homework_obj = homework.attributes

        earned_grades = EarnedGrade.where({:user_id => student_id, :homework_id => homework.id, :gradebook_id => gradebook.id})
        earned_grades.each do |earned_grade|
          gsg = GradingScaleGrade.find_by_id(earned_grade.grading_scale_grade_id)
          homework_obj['grade'] = gsg.name
          homework_obj['visualization'] = gsg.visualization_level
        end

        klass_obj['homeworks'] << homework_obj
        klass_obj['final_grade'] = klass.get_klass_grade
      end

      klasses_array << klass_obj
    end

    return {
      user: user,
      klasses: klasses_array
    }
  end

  def get_user_report
    users_array = []
    if current_user.is_parent?
      current_user.children.each do |child|
        users_array << _get_user_report(child)
      end
    elsif current_user.is_student?
      users_array << _get_user_report(current_user)
    end

    render json: users_array, status: 200
  end


end
