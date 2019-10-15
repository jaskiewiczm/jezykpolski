# frozen_string_literal: true

class StudentsController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def student
    render json: Student.all.map(&:attributes)
  end

  def add_student

    render json: {}, status: 200
  end

  def delete_student

    render json: {}, status: 200
  end

  def update_student

    render json: {}, status: 200
  end
end
