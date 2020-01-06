class Semester < ActiveRecord::Migration[5.2]
  def up
    add_column :users, :sign_in_count, :integer, :default => 0, :null => false
    remove_column :bills, :school_year_id
    remove_column :schools, :school_year_id
    drop_table :school_years

    create_table 'school_periods', force: true do |t|
      t.string :year_span
      t.string :period_name
      t.bigint :school_id
      t.timestamps
    end

    add_column :schools, :active_period_id, :bigint

    add_foreign_key :schools, :school_periods, column: :active_period_id, primary_key: 'id'
    add_foreign_key :school_periods, :schools, column: :school_id, primary_key: 'id'

    sp1 = SchoolPeriod.create(:year_span => '2019 - 2020', :period_name => 'Semester 1', :school_id => 1)
    sp2 = SchoolPeriod.create(:year_span => '2019 - 2020', :period_name => 'Semester 2', :school_id => 1)
    s = School.find_by_id 1
    s.active_period_id = sp2.id
    s.save!
  end

  def down
    remove_column :users, :sign_in_count
    drop_table :school_periods
    remove_column :schools, :active_period_id
  end
end
