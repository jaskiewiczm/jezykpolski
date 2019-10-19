# frozen_string_literal: true

class EnrollmentsController < ApplicationController
  before_action :authenticate_user!

  def get_enrollments
    params.require(:userId)

    klasses = User.find_by_id(params[:userId]).klasses.map(&:attributes)

    render json: klasses, status: 200
  end

  def add_enrollments
    params.require(:userId)
    params.require(:klassId)

    user = User.find_by_id(params[:userId])
    klass = Klass.find_by_id(params[:klassId])

    user.klasses.append(klasses)

    render json: klasses, status: 200
  end

  def delete_enrollment
    params.require(:userId)
    params.require(:klassId)

    user = User.find_by_id(params[:userId])
    klass = Klass.find_by_id(params[:klassId])

    user.klasses.destroy(klass)

    render json: klasses, status: 200
  end

end