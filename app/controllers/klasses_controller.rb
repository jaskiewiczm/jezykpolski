# frozen_string_literal: true

class KlassesController < ApplicationController
  before_action :authenticate_user!
  before_action :check_permissions, except: [:get_klasses]

  def initialize
    @permitted_role_codes = ['teacher', 'admin', 'school_admin']
  end

  def check_permissions
    if current_user.roles.where(:code => @permitted_role_codes).count == 0
      raise NotAuthorized
    end
  end

  def index
    render 'layouts/application'
  end

  def get_klasses
    if current_user.is_admin? || current_user.is_school_admin?
      klasses = Klass.where('school_id = ?', params[:schoolId])
    elsif current_user.is_teacher?
      klasses = current_user.taught_klasses
    elsif current_user.is_parent?
      klasses = []
    else
      klasses = current_user.klasses.active
    end

    klasses = klasses.map(&:attributes)
    render json: klasses, status: 200
  end

  def updateActivityPercentages(klass)
    if params.has_key? :activityPercentages
      aps = params[:activityPercentages]


      klass.klass_activity_types.each do |kat|
        activity_type = aps.select {|ap| ap[:activity_id] == kat.activity_type_id}
        activity_type = activity_type.first
        kat.percentage = activity_type[:percentage]
        kat.save!
      end
    end
  end

  def update
    params.require(:klassId)
    params.require(:name)

    klass = Klass.find_by_id params[:klassId]
    klass.name = params[:name]

    if params.has_key? :teacherId
      klass.teacher_id = params[:teacherId]
    end

    klass.save!

    updateActivityPercentages(klass)

    render json: {}, status: 200
  end

  def add
    params.require(:name)
    params.require(:schoolId)

    klass = Klass.new
    klass.name = params[:name]
    klass.school_id = params[:schoolId]

    if params.has_key? :teacherId
      klass.teacher_id = params[:teacherId]
    end

    klass.save!

    acts = ActivityType.all
    acts.each do |act|
      klass.activity_types.append(act)
    end

    updateActivityPercentages(klass)

    render json: {}, status: 200
  end

  def delete
    params.require(:klassId)

    klass = Klass.find_by_id params[:klassId]
    klass.destroy!

    render json: {}, status: 200
  end

  def download
    params.require(:klassId)
    klass = Klass.find_by_id params[:klassId]
    send_file(klass.enrollment_to_excel_file)
  end

end
