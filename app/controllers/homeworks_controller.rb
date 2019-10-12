# frozen_string_literal: true

class HomeworksController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def homework
    render json: Homework.all.map(&:attributes)
  end
end
