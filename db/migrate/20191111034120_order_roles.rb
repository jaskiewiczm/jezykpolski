class OrderRoles < ActiveRecord::Migration[5.2]
  def up
    add_column :roles, :sort, :integer

    r = Role.where('code = ?', 'student').first
    r.sort = 0
    r.save!
    r = Role.where('code = ?', 'parent').first
    r.sort = 1
    r.save!
    r = Role.where('code = ?', 'teacher').first
    r.sort = 2
    r.save!
    r = Role.where('code = ?', 'school_admin').first
    r.sort = 3
    r.save!

  end

  def down
    drop_column :roles, :sort
  end
end
