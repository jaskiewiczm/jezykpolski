# frozen_string_literal: true

class BillingsController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

end
