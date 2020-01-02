class RenameRateAdjColumn < ActiveRecord::Migration[5.2]
  def up
    rename_column :rate_adjustments, :delta, :amount
  end

  def down
    rename_column :rate_adjustments, :amount, :delta
  end
end
