# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def students
    params.require(:schoolId)

    users = User.joins(:user_roles).joins(:roles).where(roles: {code: 'student'})
    users = users.map(&:attributes)
    users = users.map{|user| user.select {|k,v| [:email.to_s, :id.to_s, :name.to_s].include?(k)}}

    render json: users, status: 200
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

    parents = {}
    users.each do |user|
      parents[user.id] = user.parents.map {|parent| parent.id}
    end

    users = users.map(&:attributes)
    users = users.map{|user| user.select {|k,v| [:email.to_s, :id.to_s, :name.to_s].include?(k)}}

    users.each do |user|
      user['userRoles'] = userRoles[user['id']]
      user['parents'] = parents[user['id']]
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

    _parent_update(u)

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

  def _parent_update(u)
    u.parents.clear()
    parent_1 = User.find_by_id(params[:parent1Id]) if params.has_key? :parent1Id
    parent_2 = User.find_by_id(params[:parent2Id]) if params.has_key? :parent2Id
    u.parents.append(parent_1) if parent_1.present?
    u.parents.append(parent_2) if parent_2.present?
  end

  def update_user
    params.require(:userId)
    params.require(:name)
    params.require(:email)

    u = User.find_by_id(params[:userId])
    u.name = params[:name]
    u.email = params[:email]

    _parent_update(u)

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

  def validate_user_email_uniqueness
    params.require(:email)

    if User.where(:email => params[:email]).count > 0
      render json: {unique: false}, status: 200
    else
      render json: {unique: true}, status: 200
    end
  end

  def validate_user_name_uniqueness
    params.require(:name)

    if User.where(:name => params[:name]).count > 0
      render json: {unique: false}, status: 200
    else
      render json: {unique: true}, status: 200
    end
  end
end
