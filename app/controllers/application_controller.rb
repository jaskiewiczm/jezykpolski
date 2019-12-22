# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :security_checks

  NotAuthorized = Class.new(StandardError)
  SecurityCheckFailure = Class.new(StandardError)

  def index
    render 'layouts/application'
  end

  rescue_from ApplicationController::NotAuthorized do |exception|
    render json: {}, status: 403
  end

  def security_checks
    if current_user.present?
      if params.has_key? :userId && params[:userId] != current_user.id
        sl = SecurityLog.new!
        sl.error = "UserId #{current_user.id} masquerading as #{params[:userId]}"
        sl.user_id = current_user.id
        sl.save!
        raise SecurityCheckFailure
      end

      if params.has_key? :schoolId
        if !current_user.is_admin?
          if params[:schoolId] != current_user.school.id
            sl = SecurityLog.new!
            sl.error = "UserId #{current_user.id} from school #{current_user.school.id} accessing #{params[:schoolId]}"
            sl.user_id = current_user.id
            sl.save!
          end
        end
      end

      if params.has_key? :klassId
        if !current_user.is_admin?
          if current_user.is_student?
            klass_ids = current_user.klasses.map {|klass| klass.id}
            if !klass_ids.include? params[:klassId]
              sl = SecurityLog.new!
              sl.error = "UserId #{current_user.id} from school #{current_user.school.id} accessing klass #{params[:klassId]}"
              sl.user_id = current_user.id
              sl.save!
            end
          end
        end
      end
    end
  end

end
