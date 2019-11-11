# frozen_string_literal: true

class GradebooksController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def get_gradebook
    params.require(:klassId)

    klass = Klass.find_by_id params[:klassId]
    users = klass.users
    homeworks = klass.homeworks.where(:disabled => false)
    grades = klass.gradebook.earned_grades

    homeworks = homeworks.map(&:attributes)
    homeworks = homeworks.sort_by {|h| h['due_date']}

    json = {
      users: users.map(&:attributes),
      homeworks: homeworks,
      grades: grades.map(&:attributes)
    }

    render json: json, status: 200
  end

  def set_grade
    #params.require(:userId).require(:homeworkId).require(:gradingScaleGradeId)

    homework = Homework.find_by_id params[:homeworkId]
    user = User.find_by_id params[:userId]
    gradebook = homework.klass.gradebook
    grading_scale_grade = GradingScaleGrade.find_by_id params[:gradingScaleGradeId]

    if params[:earnedGradeId].nil?
      earned_grade = EarnedGrade.new
      earned_grade.user = user
      earned_grade.homework = homework
      earned_grade.gradebook = gradebook
    else
      earned_grade = EarnedGrade.find_by_id(params[:earnedGradeId])
    end

    earned_grade.grading_scale_grade = grading_scale_grade
    earned_grade.save!

    render json: {grade: earned_grade}, status: 200
  end

end