# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def users
    render json: User.all.map(&:attributes)
  end

  def add_user
    params.require(:name)
    params.require(:email)

    u = User.new
    u.name = params[:name]
    u.email = params[:email]
    u.password = 'TEMP_PASSWORD'
    u.password_confirmation = 'TEMP_PASSWORD'
    u.save!

    render json: {}, status: 200
  end

  def delete_user
    params.require(:userId)

    u = User.find_by_id(params[:userId])
    u.destroy!

    render json: {}, status: 200
  end

  def update_user
    params.require(:userId)
    params.require(:name)
    params.require(:email)

    u = User.find_by_id(params[:userId])
    u.name = params[:name]
    u.email = params[:email]
    u.save!

    render json: {}, status: 200
  end
end
