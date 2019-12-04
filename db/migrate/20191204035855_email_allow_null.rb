class EmailAllowNull < ActiveRecord::Migration[5.2]
  def up
    change_column :users, :email, :string, null: true
    remove_index :users, :email
  end
end
