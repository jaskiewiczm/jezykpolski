# frozen_string_literal: true

class HomeworksController < ApplicationController
  def index
    render 'layouts/application'
  end

  def homework
    render json: Homework.all.map(&:attributes)
  end
end
