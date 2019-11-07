# frozen_string_literal: true

class GradebooksController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def get_gradebook
    params.require(:schoolId).require(:klassId)

    klass = Klass.find_by_id params[:klassId]
    users = klass.users
    homeworks = klass.homeworks
    grades = klass.gradebook.earned_grades

    json = {
      users: users.map(&:attributes),
      homeworks: homeworks.map(&:attributes),
      grades: grades.map(&:attributes)
    }

    render json: json, status: 200
  end

  def set_grade
    params.require(:userId).require(:homeworkId).require(:gradingScaleGradeId)

    homework = Homework.find_by_id params[:homeworkId]
    user = User.find_by_id params[:userId]
    gradebook = homework.klass.gradebook
    grading_scale_grade = GradingScaleGrade.find_by_id params[:gradingScaleGradeId]

    earned_grade = gradebook.earned_grades.find {|eg| eg.user.id == params[:userId] && eg.homework.id == params[:homeworkId]}
    if earned_grade.nil?
      earned_grade = EarnedGrade.new
      earned_grade.user = user
      earned_grade.homework = homework
    end

    earned_grade.grading_scale_grade = grading_scale_grade
    earned_grade.save!

    render json: {}, status: 200
  end

end