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
end
