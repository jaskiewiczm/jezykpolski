class Grades < ActiveRecord::Migration[5.2]
  def up
    create_table 'grading_scales', force: true do |t|
      t.string 'name', :null => false
      t.timestamps
    end

    create_table 'grading_scale_grades', force: true do |t|
      t.string 'name', :null => false
      t.float 'value'
      t.integer 'grading_scale_id'
      t.integer 'order', :null => false
      t.integer 'lower_bound_inclusive'
      t.integer 'upper_bound_inclusive'
      t.timestamps
    end

    create_table 'earned_grades', force: true do |t|
      t.integer 'gradebook_id', :null => false
      t.integer 'user_id', :null => false
      t.integer 'grading_scale_grades', :null => false
      t.timestamps
    end

    gs = GradingScale.new
    gs.name = 'Basic'
    gs.save!

    (1..5).each do |n|
      gsg = GradingScaleGrade.new
      gsg.name = n.to_s
      gsg.value = n
      gsg.grading_scale_id = gs.id
      gsg.order = n
      gsg.save!
    end
  end

  def down
    drop_table :earned_grades
    drop_table :grading_scale_grades
    drop_table :grading_scales
  end
end
