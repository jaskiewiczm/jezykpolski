# frozen_string_literal: true

class BillingsController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def get_meta_bills
    params.require(:schoolId)

    metabills = MetaBill.where({:school_id => params[:schoolId], :soft_delete => false})
    metabills = metabills.map(&:attributes)

    render json: metabills, status: 200
  end

  def add_meta_bill

  end

  def edit_meta_bill
    params.require(:metaBillId)
  end

  def delete_meta_bill
    params.require(:metaBillId)

    mb = MetaBill.find_by_id(params[:metaBillId])
    mb.soft_delete = true
    mb.save!

    render json: {}, status: 200
  end

end
