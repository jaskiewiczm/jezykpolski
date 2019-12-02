class SoftUnenroll < ActiveRecord::Migration[5.2]
  def up
    add_column :user_klasses, :soft_unenrolled, :integer, :default => 0
  end

  def down
    remove_column :user_klasses, :soft_unenrolled
  end
end
