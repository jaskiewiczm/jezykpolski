# frozen_string_literal: true

class BillingsController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def get_active_bills
    params.require(:schoolId)

    bills = Bill.joins(:bill_meta_bills).joins(:meta_bills).joins(:user).where({:school_id => params[:schoolId], :soft_delete => false})
    hash_bills = bills.map(&:attributes)

    adj_hash_bills = []
    hash_bills.each do |hash_bill|
      adj_hash_bills.append(hash_bill.except("created_at", "updated_at"))
    end
    hash_bills = adj_hash_bills

    bills.each_with_index do |bill, index|
      user = bill.user.attributes.slice('id', 'name')
      user['user_id'] = user.delete('id')
      user['user_name'] = user.delete('name')
      hash_bills[index].merge!(user)

      meta_bills = bill.meta_bills.map(&:attributes)
      hash_meta_bills = []
      meta_bills.each do |meta_bill|
        meta_bill = meta_bill.slice('id', 'name', 'amount')
        meta_bill['meta_bill_id'] = meta_bill.delete('id')
        meta_bill['meta_bill_name'] = meta_bill.delete('name')
        hash_meta_bills.append(meta_bill)
      end

      hash_bills[index]['meta_bills'] = hash_meta_bills
      hash_bills[index]['total'] = bill.total
    end

    render json: hash_bills, status: 200
  end

  def add_bill
    params.require([:userId, :schoolId])

    bill = Bill.create(:user_id => params[:userId], :school_id => params[:schoolId])

    if params.has_key? :metaBillIds
      params[:metaBillIds].each do |meta_bill_id|
        mb = MetaBill.find_by_id meta_bill_id
        bill.meta_bills.append(mb)
      end
    end
  end

  def edit_bill
    params.require(:billId)

    bill = Bill.find_by_id params[:billId]
    bill.meta_bills.clear

    if params.has_key? :metaBillIds
      params[:metaBillIds].each do |meta_bill_id|
        mb = MetaBill.find_by_id meta_bill_id
        bill.meta_bills.append(mb)
      end
    end
  end

  def delete_bill
    params.require(:billId)
    bill = Bill.find_by_id(params[:billId])
    bill.update_attribute!(:soft_delete => true)
  end

  def get_meta_bills
    params.require(:schoolId)

    metabills = MetaBill.where({:school_id => params[:schoolId], :soft_delete => false})
    metabills = metabills.map(&:attributes)

    render json: metabills, status: 200
  end

  def add_meta_bill
    params.require([:billName, :billValue, :billType, :schoolId])

    mb = MetaBill.create({:name => params[:billName],
                          :amount => params[:billValue],
                          :bill_type => params[:billType],
                          :school_id => params[:schoolId]})
    render json: {}, status: 200
  end

  def edit_meta_bill
    params.require([:metaBillId, :billName, :billValue, :billType])

    mb = MetaBill.find_by_id(params[:metaBillId])
    mb.update_attributes!({:name => params[:billName],
                           :amount => params[:billValue],
                           :bill_type => params[:billType]})

  end

  def delete_meta_bill
    params.require(:metaBillId)

    mb = MetaBill.find_by_id(params[:metaBillId])
    mb.soft_delete = true
    mb.save!

    render json: {}, status: 200
  end

end
