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
      roles = roles.map(&:attributes)

      roles = roles.map {|role| role.except(:created_at.to_s, :updated_at.to_s)}
      userRoles[user.id] = roles
    end

    users = users.map(&:attributes)
    users = users.map{|user| user.select {|k,v| [:email.to_s, :id.to_s, :name.to_s, :parent_1_id.to_s, :parent_2_id.to_s].include?(k)}}

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

    is_system_admin = u.roles.where('code = ?', 'admin').count > 0

    u.roles.clear

    params[:roles].each do |role_id|
      u.roles.append(Role.find_by_id(role_id))
    end

    if is_system_admin
      u.roles.append(Role.where('code = ?', 'admin').first)
    end

    u.save!

    render json: {}, status: 200
  end

  def get_user_roles
    roles = current_user.roles.map(&:attributes)
    render json: roles, status: 200
  end
end
