# frozen_string_literal: true

class SchoolsController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def get_schools
    admin_roles = current_user.roles.select {|role| role.code == 'admin'}
    if admin_roles.length > 0
      schools = School.all.map(&:attributes)
    else
      schools = [current_user.school.attributes]
    end
    render json: schools, status: 200
  end
end
