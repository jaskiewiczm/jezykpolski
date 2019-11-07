class LinkEarnedGradesToHomework < ActiveRecord::Migration[5.2]
  def up
    add_column :earned_grades, :homework_id, :integer, :null => false
  end

  def down
    drop_column :earned_grades, :homework_id
  end
end
