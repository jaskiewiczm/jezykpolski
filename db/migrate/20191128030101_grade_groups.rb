class GradeGroups < ActiveRecord::Migration[5.2]
  def up
    add_column :grading_scale_grades, :group, :integer

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

    group = 0
    possible_group = nil
    gsgs.each do |gsg|
        current_possible_group = gsg.name.gsub(/[+-]/, '')
        if possible_group != current_possible_group
          possible_group = current_possible_group
          group += 1
        end
        gsg.group = group
        gsg.save!
    end
  end

  def down
    remove_column :grading_scale_grades, :group
  end
end
