class BillingSoftDelete < ActiveRecord::Migration[5.2]
  def up
    add_column :meta_bills, :soft_delete, :boolean, :default => false
    add_column :bills, :soft_delete, :boolean, :default => false
    add_column :meta_bill_rate_adjustments, :soft_delete, :boolean, :default => false
    add_column :rate_adjustments, :soft_delete, :boolean, :default => false
  end

  def down
    remove_column :meta_bills, :soft_delete
    remove_column :bills, :soft_delete
    remove_column :meta_bill_rate_adjustments, :soft_delete
    remove_column :rate_adjustments, :soft_delete
  end
end
