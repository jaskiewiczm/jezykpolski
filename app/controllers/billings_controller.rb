# frozen_string_literal: true

class BillingsController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end


  def get_meta_bills
    params.require(:schoolId)

    metabills = MetaBill.where(:school_id => params[:schoolId])
    metabills = metabills.map(&:attributes)

    render json: metabills, status: 200
  end


end
