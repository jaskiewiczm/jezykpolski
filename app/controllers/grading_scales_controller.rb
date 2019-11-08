# frozen_string_literal: true

class GradingScalesController < ApplicationController

  def get_grading_scale
    gs = GradingScale.includes(:grading_scale_grades).where(:name => 'Basic').first

    gsgs = gs.grading_scale_grades.map(&:attributes)
    gsgs = gsgs.sort_by {|gsg| gsg['order']}.reverse

    render json: {scale: gsgs}, status: 200
  end

end