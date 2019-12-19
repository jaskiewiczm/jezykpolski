class BillingStart < ActiveRecord::Migration[5.2]
  def up
    create_table :school_years, force: true do |t|
      t.string 'period', :null => false
      t.float :default_tuition
      t.timestamps
    end

    create_table :bills, force: true do |t|
      t.bigint :user_id
      t.bigint :school_year_id
      t.timestamps
    end

    create_table :rate_adjustments, force: true do |t|
      t.float :delta
      t.timestamps
    end

    create_table :user_rate_adjustments, force: true do |t|
      t.bigint :bill_id
      t.bigint :rate_adjustment_id
      t.timestamps
    end

    add_foreign_key :bills, :school_years, column: :school_year_id, primary_key: 'id'
    add_foreign_key :bills, :users, column: :user_id, primary_key: 'id'

    add_foreign_key :user_rate_adjustments, :bills, column: :bill_id, primary_key: 'id'
    add_foreign_key :user_rate_adjustments, :rate_adjustments, column: :rate_adjustment_id, primary_key: 'id'

  end

  def down
    drop_table :user_rate_adjustments
    drop_table :rate_adjustments
    drop_table :bills
    drop_table :school_years
  end
end
