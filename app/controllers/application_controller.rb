# frozen_string_literal: true

class ApplicationController < ActionController::Base
  NotAuthorized = Class.new(StandardError)

  def index
    render 'layouts/application'
  end

  rescue_from ApplicationController::NotAuthorized do |exception|
    render json: {}, status: 403
  end

end
