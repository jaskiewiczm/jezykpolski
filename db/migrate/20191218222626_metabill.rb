class Metabill < ActiveRecord::Migration[5.2]
  def up
    create_table :meta_bills, force: true do |t|
      t.float :amount
      t.string :name
      t.timestamps
    end

    add_column :bills, :meta_bill_id, :bigint
    add_foreign_key :bills, :meta_bills, column: :meta_bill_id, primary_key: 'id'
    remove_column :school_years, :default_tuition
  end

  def down
    add_column :school_years, :default_tuition, :float
    remove_column :bills, :meta_bill_id
    drop_table :meta_bills
  end
end
