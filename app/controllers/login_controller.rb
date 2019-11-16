# frozen_string_literal: true

class LoginController < ApplicationController
  include Devise::Controllers::Helpers

  def whoami
    if current_user
      user = {user: current_user.attributes, roles: current_user.roles.map(&:attributes)}
      render json: user, status: 200
    else
      render json: {}, status: 404
    end
  end

  def login
    params.require [:email, :password]
    user = User.includes(:roles).where(:email => params[:email]).first
    if user.present? && user.valid_password?(params[:password])
      sign_in user
      roles = user.roles.map(&:attributes)
      user = user.attributes
      user['roles'] = roles

      render json: user, status: 200
    else
      render json: { errors: "Invalid email or password" }, status: 422
    end
  end

  def logout
    sign_out current_user
    render json: {}, status: 200
  end
end
