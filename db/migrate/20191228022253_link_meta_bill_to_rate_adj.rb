class LinkMetaBillToRateAdj < ActiveRecord::Migration[5.2]
  def up
    create_table :meta_bill_rate_adjustments, force: true do |t|
      t.bigint :meta_bill_id
      t.bigint :rate_adjustment_id
      t.timestamps
    end

    add_foreign_key :meta_bill_rate_adjustments, :meta_bills, column: :meta_bill_id, primary_key: 'id'
    add_foreign_key :meta_bill_rate_adjustments, :rate_adjustments, column: :rate_adjustment_id, primary_key: 'id'
  end

  def down
    drop_table :meta_bill_rate_adjustments
  end
end
