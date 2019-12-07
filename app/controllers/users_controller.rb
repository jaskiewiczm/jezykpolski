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

    name_unique = validate_user_name_uniqueness(params[:name])
    email_unique = true
    if params.has_key? :email
      email_unique = validate_user_email_uniqueness(params[:email])
    end

    if !name_unique || !email_unique
      render json: {name_unique: name_unique, email_unique: email_unique}, status: 406
    else
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

      render json: {name_unique: name_unique, email_unique: email_unique}, status: 200
    end
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

  def password_reset
    params.require(:newPassword)
    params.require(:userId)

    if current_user.roles.where('code like ?', '%admin%')
      u = User.find_by_id(params[:userId])
      u.password = params[:newPassword]
      u.password_confirmation = params[:newPassword]
      u.save!
    else
      params.require(:oldPassword)
      if current_user.id == params[:userId] && current_user.valid_password?(params[:oldPassword])
        current_user.password = params[:newPassword]
        current_user.password_confirmation = params[:newPassword]
        current_user.save!
      end
    end

    render json: {}, status: 200
  end

  def update_user
    params.require(:userId)
    params.require(:name)

    u = User.find_by_id(params[:userId])
    name_unique = validate_user_name_uniqueness(params[:name], u)
    email_unique = true
    p email_unique
    if params.has_key? :email
      email_unique = validate_user_email_uniqueness(params[:email], u)
      p email_unique
    end

    p email_unique
    if !name_unique || !email_unique
      render json: {name_unique: name_unique, email_unique: email_unique}, status: 406
    else
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

      render json: {name_unique: name_unique, email_unique: email_unique}, status: 200
    end
  end

  def get_user_roles
    roles = current_user.roles.map(&:attributes)
    render json: roles, status: 200
  end

  def validate_user_email_uniqueness(email, target_user=nil)
    if target_user.present?
      if email == target_user.email
        return true
      elsif User.where(:email => email).count > 0
        return false
      end
    elsif User.where(:email => email).count > 0
      return false
    end

    return true
  end

  def validate_user_name_uniqueness(name, target_user=nil)
    if target_user.present?
      if name == target_user.name
        return true
      elsif User.where(:name => name).count > 0
        return false
      end
    elsif User.where(:name => name).count > 0
      return false
    end

    return true
  end
end
