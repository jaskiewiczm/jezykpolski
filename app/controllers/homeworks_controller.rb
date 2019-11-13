# frozen_string_literal: true
require 'sanitize'

class HomeworksController < ApplicationController
  before_action :authenticate_user!
  before_action :check_permissions, only: [:add_homework, :delete_homework, :update_homework_description]

  def initialize
    @permitted_role_codes = ['teacher', 'admin', 'school_admin']
  end

  def check_permissions
    if current_user.roles.where(:code => @permitted_role_codes).count == 0
      raise NotAuthorized
    end
  end

  def index
    render 'layouts/application'
  end

  def homework
    if Rails.env.production?
      render json: Homework.where('klass_id = ? and disabled=false', params[:klassId]).order(due_date: :desc).map(&:attributes)
    else
      render json: Homework.where('klass_id = ? and disabled=0', params[:klassId]).order(due_date: :desc).map(&:attributes)
    end
  end

  def add_homework
    h = Homework.new
    h.description = Sanitize.fragment(params[:description], :elements => ['b', 'strong', 'p', 'i', 'ul', 'li', 'ol', 'del', 'u'])
    h.due_date = params[:dueDate]
    h.klass_id = params[:selectedKlassId]
    h.title = params[:title]
    h.save!
    render json: {}, status: 200
  end

  def delete_homework
    homework = Homework.find_by_id params[:homeworkId]
    homework.disabled = true
    homework.save!
    render json: {}, status: 200
  end

  def update_homework_description
    homework = Homework.find_by_id params[:homeworkId]
    homework.description = Sanitize.fragment(params[:description], :elements => ['b', 'strong', 'p', 'i', 'ul', 'li', 'ol', 'del', 'u'])
    homework.due_date = params[:dueDate]
    homework.title = params[:title]
    homework.save!
    render json: {}, status: 200
  end
end
