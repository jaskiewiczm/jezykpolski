# frozen_string_literal: true

class LoginController < ApplicationController
  include Devise::Controllers::Helpers

  def login
    params.require [:email, :password]
    user = User.where(:email => params[:email]).first
    if user.present? && user.valid_password?(params[:password])
      sign_in user

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
