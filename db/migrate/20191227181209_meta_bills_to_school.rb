class MetaBillsToSchool < ActiveRecord::Migration[5.2]
  def up
    add_column :meta_bills, :school_id, :bigint
    add_foreign_key :meta_bills, :schools, column: :school_id, primary_key: 'id'

    add_column :schools, :school_year_id, :bigint
    add_foreign_key :schools, :school_years, column: :school_year_id, primary_key: 'id'
  end

  def down
    remove_column :meta_bills, :school_id
    remove_column :schools, :school_year_id
  end
end
