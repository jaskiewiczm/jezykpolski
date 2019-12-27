# frozen_string_literal: true
require 'uri'

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
    user = User.includes(:roles).where({:email => params[:email], :disabled => false}).first
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

  def update_self
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
    end

    render json: {}, status: 403
  end

  def jwt_login
    params.require :jwt
    if current_user.nil?
      secret = Rails.application.config.jwt['JWT_SECRET']
      decoded_token = JWT.decode params[:jwt], secret, true, { algorithm: 'HS256' }
      user_token = decoded_token.select {|item| item.has_key? 'user_id'}
      user_id = user_token[0]['user_id']

      user = User.find_by_id user_id
      if user.present? && user.disabled == false
        sign_in user
        redirect_to '/jwt_reset_password'
      end
    else
      redirect_to '/'
    end
  end

  def request_password_reset
    params.require :email

    user = User.where(:email => params[:email]).first
    if user.present?
      payload = { :user_id => user.id, :encoded_at => DateTime.now }
      secret = Rails.application.config.jwt['JWT_SECRET']
      token = JWT.encode payload, secret, 'HS256'
      url = URI.join(Rails.application.config.application['HOST'],"jwt_login").to_s
      url = url << "?jwt=#{token}"

      email_obj = {to: user.email,
       from: 'no-reply@jezykpol.ski',
       subject: "JezykPolski Password Reset",
       body: "A password reset has been requested for #{user.name}. Please <a href='#{url}'>continue</a> to the reset page"
      }

      email = JezykPolskiEmail.new
      email.send_email(email_obj)
      email.save!
    end
  end

  def reset_password
    params.require [:newPassword, :passwordConfirmation]

    current_user.password = params[:newPassword]
    current_user.password_confirmation = params[:newPasswordConfirmation]
    current_user.save!

    render json: {}, status: 200
  end
end
