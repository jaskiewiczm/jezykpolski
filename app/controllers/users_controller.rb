# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def users
    users = User.all.order(:name)

    userRoles = {}
    users.each do |user|
      roles = user.roles.order(:name)
      userRoles[user.id] = roles.map(&:attributes)
    end

    users = users.map(&:attributes)

    users.each do |user|
      user['userRoles'] = userRoles[user['id']]
    end

    render json: users
  end

  def add_user
    params.require(:name)
    params.require(:email)

    u = User.new
    u.name = params[:name]
    u.email = params[:email]
    u.password = 'TEMP_PASSWORD'
    u.password_confirmation = 'TEMP_PASSWORD'

    params[:roles].each do |role_id|
      u.roles.append(Role.find_by_id(role_id))
    end

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

    u.roles.clear

    params[:roles].each do |role_id|
      u.roles.append(Role.find_by_id(role_id))
    end

    u.save!

    render json: {}, status: 200
  end

  def get_user_roles
    roles = current_user.roles.map(&:attributes)
    render json: roles, status: 200
  end
end
