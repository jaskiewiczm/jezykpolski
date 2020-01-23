class UpperBound6 < ActiveRecord::Migration[5.2]
  def up
  	gsg = GradingScaleGrade.where(:value => 6).first
  	gsg.upper_bound_exclusive = 6.1
  	gsg.save!
  end
end
