# frozen_string_literal: true

class EnrollmentsController < ApplicationController
  before_action :authenticate_user!

  def get_enrollments
    params.require(:userId)
    #params.require(:schoolId)

    klasses = User.find_by_id(params[:userId]).klasses.map(&:attributes)

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

    user.klasses.append(klass)

    render json: {}, status: 200
  end

  def delete_enrollment
    params.require(:userId)
    params.require(:klassId)

    user = User.find_by_id(params[:userId])
    klass = Klass.find_by_id(params[:klassId])

    user.klasses.destroy(klass)

    render json: {}, status: 200
  end

end