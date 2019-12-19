class RemainingTotal < ActiveRecord::Migration[5.2]
  def up
    add_column :bills, :paid_amount, :float
  end

  def down
    remove_column :bills, :paid_amount
  end
end
