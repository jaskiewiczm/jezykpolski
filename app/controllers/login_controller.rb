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

  def password_reset
    if current_user.present?
      params.require(:oldPassword).require(:newPassword).require(:newPasswordConfirmation)
      if current_user.valid_password?(params[:oldPassword])
        current_user.password = params[:newPassword]
        current_user.password_confirmation = params[:newPasswordConfirmation]
        current_user.save!
        render json: {}, status: 200
      else
        render json: {}, status: 403
      end
    else
      params.require [:jwt, :newPassword, :newPasswordConfirmation]
      secret = Rails.application.config.jwt['JWT_SECRET']
      decoded_token = JWT.decode params[:jwt], secret, true, { algorithm: 'HS256' }
      user_id = decoded_token['user_id']

      user = User.find_by_id user_id
    end

    render json: {}, status: 403
  end
end
