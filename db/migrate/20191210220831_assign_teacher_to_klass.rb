class AssignTeacherToKlass < ActiveRecord::Migration[5.2]
  def up
    add_column :klasses, :teacher_id, :bigint
  end

  def down
    remove_column :klasses, :teacher_id
  end
end
