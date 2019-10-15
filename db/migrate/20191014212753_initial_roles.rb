class InitialRoles < ActiveRecord::Migration[5.2]
  def change
    add_column :roles, :code, :string

    r = Role.new
    r.name = 'Administrator'
    r.code = 'admin'
    r.save!

    r = Role.new
    r.name = 'Teacher'
    r.code = 'teacher'
    r.save!

    r = Role.new
    r.name = 'School Administrator'
    r.code = 'school_admin'
    r.save!

  end
end
