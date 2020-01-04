class HomeworkToActivities < ActiveRecord::Migration[5.2]
  def up
    create_table 'activity_types', force: true do |t|
      t.string :name
      t.string :code
      t.timestamps
    end

    create_table 'klass_activity_types', force: true do |t|
      t.float :percentage
      t.bigint :klass_id
      t.bigint :activity_type_id
      t.timestamps
    end

    add_foreign_key :klass_activity_types, :klasses, column: :klass_id, primary_key: 'id'
    add_foreign_key :klass_activity_types, :activity_types, column: :activity_type_id, primary_key: 'id'

    ActivityType.create(:name => 'Homework', :code => 'homework')
    ActivityType.create(:name => 'Exam', :code => 'exam')
    ActivityType.create(:name => 'Quiz', :code => 'quiz')
    ActivityType.create(:name => 'Project', :code => 'project')
    ActivityType.create(:name => 'Attendance', :code => 'attendance')

    add_column :homeworks, :activity_type_id, :bigint
    add_foreign_key :homeworks, :activity_types, column: :activity_type_id, primary_key: 'id'
  end

  def down
    drop_table :activity_types
    drop_table :klass_activity_types
    remove_column :homeworks, :activity_type_id
  end
end
