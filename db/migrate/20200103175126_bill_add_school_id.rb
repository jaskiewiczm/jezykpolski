class BillAddSchoolId < ActiveRecord::Migration[5.2]
  def up
    add_column :bills, :school_id, :bigint
    add_foreign_key :bills, :schools, column: :school_id, primary_key: 'id'
  end

  def down
    remove_column :bills, :school_id
  end
end
