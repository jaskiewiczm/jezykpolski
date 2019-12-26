# frozen_string_literal: true

class JwtResetPasswordsController < ApplicationController
  before_action :authenticate_user!

  def jwt_reset_password
    render 'layouts/application'
  end
end
