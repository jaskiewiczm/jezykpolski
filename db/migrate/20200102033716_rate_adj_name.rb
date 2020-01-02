class RateAdjName < ActiveRecord::Migration[5.2]
  def up
    add_column :rate_adjustments, :name, :string
  end

  def down
    remove_column :rate_adjustments, :name
  end
end
