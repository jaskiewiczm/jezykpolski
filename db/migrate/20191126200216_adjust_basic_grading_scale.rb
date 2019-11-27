class AdjustBasicGradingScale < ActiveRecord::Migration[5.2]
  def change
    gs = GradingScale.find_by(:name => 'Basic')

    gsgs =
    [
        GradingScaleGrade.find_by({:name => 'N/A', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '1', :grading_scale_id => gs.id}),
        GradingScaleGrade.new({:name => '-2', :value => 2.3, :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '2', :grading_scale_id => gs.id}),
        GradingScaleGrade.new({:name => '+2', :value => 2.7, :grading_scale_id => gs.id}),
        GradingScaleGrade.new({:name => '-3', :value => 3.3, :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '3', :grading_scale_id => gs.id}),
        GradingScaleGrade.new({:name => '+3', :value => 3.7, :grading_scale_id => gs.id}),
        GradingScaleGrade.new({:name => '-4', :value => 4.3, :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '4', :grading_scale_id => gs.id}),
        GradingScaleGrade.new({:name => '+4', :value => 4.7, :grading_scale_id => gs.id}),
        GradingScaleGrade.new({:name => '-5', :value => 5.3, :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '5', :grading_scale_id => gs.id}),
        GradingScaleGrade.new({:name => '+5', :value => 5.5, :grading_scale_id => gs.id}),
        GradingScaleGrade.new({:name => '6', :value => 6, :grading_scale_id => gs.id})
    ]

    count = 1
    gsgs.each do |gsg|
        gsg.order = count
        count += 1
        gsg.save!
    end

  end
end
