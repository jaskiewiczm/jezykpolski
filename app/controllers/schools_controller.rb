# frozen_string_literal: true

class SchoolsController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def get_schools
    schools = School.all.map(&:attributes)
    render json: schools, status: 200
  end
end
