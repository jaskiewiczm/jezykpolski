# frozen_string_literal: true

class GradebooksController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def get_gradebook
    params.require(:schoolId).require(:klassId)


  end

end