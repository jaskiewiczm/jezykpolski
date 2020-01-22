# frozen_string_literal: true

class ActivityTypesController < ApplicationController
  before_action :authenticate_user!

  def index
    render 'layouts/application'
  end

  def get_activity_types
    if params.has_key? :klassId
      k = Klass.find_by_id params[:klassId]
      acts = []

      k.klass_activity_types.each do |kat|
        acts.append({activity_code: kat.activity_type.code,
                     activity_id: kat.activity_type.id,
                     activity_name: kat.activity_type.name,
                     percentage: kat.percentage})
      end
      acts = acts.sort_by {|act| act[:activity_name]}
      render json: acts, status: 200
    else
      acts = []
      ActivityType.all.each do |at|
        acts.append({activity_code: at.code,
                     activity_id: at.id,
                     activity_name: at.name,
                     percentage: 0})
      end
      acts = acts.sort_by {|act| act[:activity_name]}      
      render json: acts, status: 200
    end
  end
end
