class MergeRateAdjIntoMetaBill < ActiveRecord::Migration[5.2]
  def up
    add_column :meta_bills, :bill_type, :string, :required => true, :default => 'bill'
    drop_table :user_rate_adjustments
    drop_table :meta_bill_rate_adjustments
    drop_table :rate_adjustments
  end

  def down
    remove_column :meta_bills, :type
  end
end
