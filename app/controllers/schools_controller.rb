# frozen_string_literal: true

class SchoolsController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def getSchools
    render json: {School.all}, status: 200
  end
end
