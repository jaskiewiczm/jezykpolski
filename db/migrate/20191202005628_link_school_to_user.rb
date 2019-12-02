class LinkSchoolToUser < ActiveRecord::Migration[5.2]
  def up
    add_column :users, :school_id, :bigint, :references => 'schools'
  end

  def down
    remove_column :users, :school_id
  end
end
