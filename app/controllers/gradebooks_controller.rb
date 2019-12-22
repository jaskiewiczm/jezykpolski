# frozen_string_literal: true

class GradebooksController < ApplicationController
  before_action :authenticate_user!
  before_action :check_permissions

  def initialize
    @permitted_role_codes = ['teacher', 'admin', 'school_admin']
  end

  def index
    render 'layouts/application'
  end

  def check_permissions
    if current_user.roles.where(:code => @permitted_role_codes).count == 0
      raise NotAuthorized
    end
  end

  def get_gradebook
    params.require(:klassId)

    klass = Klass.find_by_id params[:klassId]
    users = klass.users.select {|user| !user.disabled}
    users = users.sort_by {|user| user.name}
    user_ids = users.map {|user| user.id}
    homeworks = klass.homeworks.where(:disabled => false)
    grades = klass.gradebook.earned_grades.includes(:jezyk_polski_email).where('user_id in (?)', user_ids)
    return_grades = grades.map(&:attributes)

    grades.each_with_index do |grade, index|
      return_grade = return_grades[index]
      if grade.jezyk_polski_email.present?
        return_grade['email'] = 'pending' if grade.jezyk_polski_email.where(:sent_at => nil).count > 0
      end
    end

    homeworks = homeworks.map(&:attributes)
    homeworks = homeworks.sort_by {|h| h['due_date']}

    json = {
      gradebook_id: klass.gradebook.id,
      users: users.map(&:attributes),
      homeworks: homeworks,
      grades: return_grades
    }

    render json: json, status: 200
  end

  def set_grade
    #params.require(:userId).require(:homeworkId).require(:gradingScaleGradeId)

    homework = Homework.find_by_id params[:homeworkId]
    user = User.find_by_id params[:userId]
    gradebook = homework.klass.gradebook
    grading_scale_grade = GradingScaleGrade.find_by_id params[:gradingScaleGradeId]

    earned_grade = nil
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

    email = JezykPolskiEmail.new
    email.update_attribute(:emailable, earned_grade)
    email.save!

    render json: {grade: earned_grade}, status: 200
  end

  def download
    params.require(:gradebookId)
    gradebook = Gradebook.find_by_id params[:gradebookId]
    send_file(gradebook.gradebook_to_excel_file)
  end

  def send_grade_emails
    params.require(:gradebookId)
    gradebook_id = params['gradebookId']

    gradebook = Gradebook.find_by_id gradebook_id
    earned_grades = gradebook.earned_grades.joins(:jezyk_polski_email).where('jezyk_polski_emails.sent_at is null')

    earned_grades.each do |eg|
      email_obj = eg.get_earned_grade_posted_email
      eg.user.emailable_users.each do |user|
        email_obj[:to] = user.email
        eg.jezyk_polski_email.first.delay.send_email(email_obj)
      end
    end
    render json: {}, status: 200
  end

end