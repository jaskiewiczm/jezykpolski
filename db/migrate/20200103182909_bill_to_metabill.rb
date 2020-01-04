class BillToMetabill < ActiveRecord::Migration[5.2]
  def up
    create_table 'bill_meta_bills', force: true do |t|
      t.bigint 'bill_id'
      t.bigint 'meta_bill_id'
      t.timestamps
    end

    add_foreign_key :bill_meta_bills, :bills, column: :bill_id, primary_key: 'id'
    add_foreign_key :bill_meta_bills, :meta_bills, column: :meta_bill_id, primary_key: 'id'
  end

  def down
    drop_table 'bill_metabills'
  end
end
