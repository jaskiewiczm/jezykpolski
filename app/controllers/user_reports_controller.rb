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
      homeworks = Homework.where('klass_id = ?', klass.id).order('due_date asc')
      homeworks.each do |homework|
        earned_grades = EarnedGrade.where({:homework_id => homework.id, :gradebook_id => gradebook.id})
                                   .group(:grading_scale_grade_id)
                                   .count

      end
    end
  end

  def get_user_report

    user = User.find_by_id current_user.id

    klasses_array = []
    user.klasses.each do |klass|
      gradebook = klass.gradebook
      klass_obj = klass.attributes
      klass_obj['homeworks'] = []

      homeworks = Homework.where('klass_id = ?', klass.id).order('due_date asc')

      homeworks.each do |homework|
        homework_obj = homework.attributes

        earned_grades = EarnedGrade.where({:user_id => current_user.id, :homework_id => homework.id, :gradebook_id => gradebook.id})
        earned_grades.each do |earned_grade|
          homework_obj['grade'] = GradingScaleGrade.find_by_id(earned_grade.grading_scale_grade_id).name
        end

        klass_obj['homeworks'] << homework_obj
        klass_obj['final_grade'] = klass.get_klass_grade
      end

      klasses_array << klass_obj
    end

    render json: klasses_array, status: 200
  end


end
