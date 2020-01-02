class SchoolIdOnRateAdj < ActiveRecord::Migration[5.2]
  def up
    add_column :rate_adjustments, :school_id, :bigint
    add_foreign_key :rate_adjustments, :schools, column: :school_id, primary_key: 'id'
  end

  def down
    remove_column :rate_adjustments, :school_id
  end
end
