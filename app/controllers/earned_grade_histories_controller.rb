# frozen_string_literal: true

class EarnedGradeHistoriesController < ApplicationController
  before_action :authenticate_user!

  def get_earned_grade_histories
    params.require(:earned_grade_id)

    histories = EarnedGradeHistory.includes(:teacher).where(:earned_grade_id => params[:earned_grade_id]).order('created_at asc')
    histories = histories.map {|history| {teacher_name: history.teacher.name, created_at: history.created_at.to_date.to_s, grade: history.grading_scale_grade.name}}

    render json: histories, status: 200
  end

end