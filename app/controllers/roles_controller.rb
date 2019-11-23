# frozen_string_literal: true

class RolesController < ApplicationController
  before_action :authenticate_user!

  def get_roles
    roles = Role.order('sort asc')
    roles = roles.map(&:attributes)
    render json: roles, status: 200
  end

end
