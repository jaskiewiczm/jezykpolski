class StudentParentRole < ActiveRecord::Migration[5.2]
  def change
    r = Role.new
    r.name = 'Student'
    r.code = 'student'
    r.save!

    r = Role.new
    r.name = 'Parent'
    r.code = 'parent'
    r.save!
  end
end
