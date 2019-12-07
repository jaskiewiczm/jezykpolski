class CustomGradeVariants < ActiveRecord::Migration[5.2]
  def up
    add_column :grading_scale_grades, :visualization_level, :string

    gs = GradingScale.find_by(:name => 'Basic')
    gsgs =
    [
        GradingScaleGrade.find_by({:name => 'N/A', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '1', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '-2', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '2', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '+2', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '-3', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '3', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '+3', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '-4', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '4', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '+4', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '-5', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '5', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '+5', :grading_scale_id => gs.id}),
        GradingScaleGrade.find_by({:name => '6', :grading_scale_id => gs.id})
    ]

    gsgs.each do |gsg|
      if gsg.value == 0
        gsg.visualization_level = 'none'
      elsif gsg.value < 3
        gsg.visualization_level = 'bad'
      elsif gsg.value < 4
        gsg.visualization_level = 'medium'
      else
        gsg.visualization_level = 'good'
      end

      gsg.save!
    end
  end

  def down
    remove_column :grading_scale_grades, :visualization_level
  end
end
