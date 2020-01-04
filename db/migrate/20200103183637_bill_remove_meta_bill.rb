class BillRemoveMetaBill < ActiveRecord::Migration[5.2]
  def up
    remove_column :bills, :meta_bill_id
  end

  def down
  end
end
