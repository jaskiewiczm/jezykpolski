class UniqueEmail < ActiveRecord::Migration[5.2]
  def up
    add_index :users, [:email, :school_id], unique: true
  end

  def down
    remove_index :users, [:email, :school_id]
  end
end
