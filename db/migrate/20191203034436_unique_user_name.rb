class UniqueUserName < ActiveRecord::Migration[5.2]
  def up
    add_index :users, [:name, :school_id], unique: true
  end

  def down
    remove_index :users, [:name, :school_id]
  end
end
