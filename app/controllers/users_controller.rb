# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def users
    render json: User.all.map(&:attributes)
  end

  def add_user

    render json: {}, status: 200
  end

  def delete_user

    render json: {}, status: 200
  end

  def update_user

    render json: {}, status: 200
  end
end
