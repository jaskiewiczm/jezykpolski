# frozen_string_literal: true

class RolesController < ApplicationController
  before_action :authenticate_user!

  def get_roles
    roles = Role.where('code != ?', 'admin').order('sort asc')
    roles = roles.map(&:attributes)
    render json: roles, status: 200
  end

end
