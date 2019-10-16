# frozen_string_literal: true
require 'sanitize'

class HomeworksController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def homework
    render json: Homework.where('klass_id = ?', params[:klassId]).map(&:attributes)
  end

  def add_homework
    h = Homework.new
    h.description = params[:description]
    #h.dueDate =
    h.save!
  end

  def delete_homework
    homework = Homework.find_by_id params[:homeworkId]
    homework.destroy!
    render json: {}, status: 200
  end

  def update_homework_description
    homework = Homework.find_by_id params[:homeworkId]
    homework.description = Sanitize.fragment(params[:description], :elements => ['b', 'strong', 'p', 'i', 'ul', 'li', 'ol', 'del', 'u'])
    homework.save!
    render json: {}, status: 200
  end
end
