# frozen_string_literal: true

class EnrollmentsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_permissions

  def initialize
    @permitted_role_codes = ['admin', 'school_admin']
  end

  def check_permissions
    if current_user.roles.where(:code => @permitted_role_codes).count == 0
      raise NotAuthorized
    end
  end

  def get_enrolled_users
    params.require(:klassId)

    k = Klass.find_by_id params[:klassId]
    users = k.users.active
    users = users.map(&:attributes)
    users = users.sort_by {|u| u['name']}

    render json: users, status: 200
  end

  def get_enrollments
    params.require(:userId)

    klasses = User.find_by_id(params[:userId]).klasses.active.map(&:attributes)

    render json: klasses, status: 200
  end

  def get_available_enrollments_for_user
    params.require(:userId)
    params.require(:schoolId)

    user_klasses = User.find_by_id(params[:userId]).klasses
    school_klasses = Klass.where('school_id = ?', params[:schoolId])
  end

  def add_enrollment
    params.require(:userId)
    params.require(:klassId)

    user = User.find_by_id(params[:userId])
    klass = Klass.find_by_id(params[:klassId])

    if not user.klasses.include? klass
      user.klasses.append(klass)
      render json: {}, status: 201
    else
      user_klass = user.user_klasses.where(:klass_id => klass.id).first
      if user_klass.soft_unenrolled == 1
        user_klass.soft_unenrolled = 0
        user_klass.save!
        render json: {}, status: 201
      else
        render json: {}, status: 403
      end
    end
  end

  def delete_enrollment
    params.require(:userId)
    params.require(:klassId)

    uk = UserKlass.where('user_id = ? and klass_id = ?', params[:userId], params[:klassId]).first
    uk.soft_unenrolled = 1
    uk.save!

    render json: {}, status: 200
  end

end