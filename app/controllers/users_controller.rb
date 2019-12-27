# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def students
    params.require(:schoolId)

    #users = User.joins(:user_roles).joins(:roles).where(roles: {code: 'student'})
    #users = users.map(&:attributes)
    #users = users.map{|user| user.select {|k,v| [:email.to_s, :id.to_s, :name.to_s].include?(k)}}

    users = get_by_role(params[:schoolId], 'student')
    render json: users, status: 200
  end

  def teachers
    params.require(:schoolId)
    users = get_by_role(params[:schoolId], 'teacher')
    render json: users, status: 200
  end

  def get_by_role(schoolId, role)
    users = User.joins(:user_roles)
                .joins(:roles)
                .where(roles: {code: role})
                .where(:disabled => false)
                .order(:name)
                .distinct
    users = users.map(&:attributes)
    users = users.map{|user| user.select {|k,v| [:email.to_s, :id.to_s, :name.to_s].include?(k)}}
    users
  end

  def users
    params.require(:schoolId)
    users = User.joins(:user_roles)
                .joins(:roles)
                .where(:school_id => params[:schoolId])
                .where(:disabled => false)
                .order(:name)
                .distinct

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
    params.require(:schoolId)

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
      if params.has_key?(:newPassword) && params.has_key?(:passwordConfirmation)
        u.password = params[:newPassword]
        u.password_confirmation = params[:passwordConfirmation]
      else
        u.password = 'TEMP_PASSWORD'
        u.password_confirmation = 'TEMP_PASSWORD'
      end
      u.school_id = params[:schoolId]

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
    u.disabled = true
    u.save!

    render json: {}, status: 200
  end

  def _parent_update(u)
    if params.has_key?(:parent1Id) || params.has_key?(:parent2Id)
      u.parents.clear()
      parent_1 = User.find_by_id(params[:parent1Id]) if params.has_key? :parent1Id
      parent_2 = User.find_by_id(params[:parent2Id]) if params.has_key? :parent2Id
      u.parents.append(parent_1) if parent_1.present?
      u.parents.append(parent_2) if parent_2.present?
    end
  end

  def _password_reset
    params.require(:userId)
    if params.has_key?(:newPassword) && params.has_key?(:passwordConfirmation) && params[:newPassword].length >= 6 && params[:passwordConfirmation].length >= 6
      if current_user.id != params[:userId] && current_user.roles.where('code like ?', '%admin%')
        # From the users page, doing a password reset for another user.
        u = User.find_by_id(params[:userId])
        u.password = params[:newPassword]
        u.password_confirmation = params[:passwordConfirmation]
        u.save!
      elsif params.has_key?(:oldPassword)
        if current_user.id == params[:userId]
          if current_user.valid_password?(params[:oldPassword])
            current_user.update_with_password({
              current_password: params[:oldPassword],
              password: params[:newPassword],
              password_confirmation: params[:passwordConfirmation]
            })
            bypass_sign_in current_user
          else
            return false
          end
        end
      end
    end
    return true
  end

  def update_user
    params.require(:userId)

    u = User.find_by_id(params[:userId])
    name_unique = validate_user_name_uniqueness(params[:name], u)
    email_unique = true

    if params.has_key? :email
      email_unique = validate_user_email_uniqueness(params[:email], u)
    end

    if !name_unique || !email_unique
      render json: {name_unique: name_unique, email_unique: email_unique}, status: 406
    else
      if params.has_key? :email
        u.email = params[:email]
      end
      if params.has_key? :name
        u.name = params[:name]
      end

      u.suppress_grades_emails = params[:suppressGradesEmail]

      _parent_update(u)
      successful_password_reset = _password_reset()
      if !successful_password_reset
        render json: {}, status: 401
      else
        if params.has_key? :roles
          is_system_admin = u.roles.where('code = ?', 'admin').count > 0
          u.roles.clear
          params[:roles].each do |role_id|
            u.roles.append(Role.find_by_id(role_id))
          end

          if is_system_admin
            u.roles.append(Role.where('code = ?', 'admin').first)
          end
        end

        u.save!
        render json: {name_unique: name_unique, email_unique: email_unique, user: u}, status: 200
      end
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
