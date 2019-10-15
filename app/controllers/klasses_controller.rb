# frozen_string_literal: true

class KlassesController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def getKlasses
    render json: {Klass.where('school_id = ?', param[:schoolId])}, status: 200
  end
end
