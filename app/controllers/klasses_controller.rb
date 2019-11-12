# frozen_string_literal: true

class KlassesController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def get_klasses
    klasses = Klass.where('school_id = ?', params[:schoolId]).map(&:attributes)
    render json: klasses, status: 200
  end

  def update
    params.require(:klassId)
    params.require(:name)

    klass = Klass.find_by_id params[:klassId]
    klass.name = params[:name]
    klass.save!

    render json: {}, status: 200
  end

  def add
    params.require(:name)
    params.require(:schoolId)

    klass = Klass.new
    klass.name = params[:name]
    klass.school_id = params[:schoolId]
    klass.save!

    render json: {}, status: 200
  end

  def delete
    params.require(:klassId)

    klass = Klass.find_by_id params[:klassId]
    klass.destroy!

    render json: {}, status: 200
  end

end