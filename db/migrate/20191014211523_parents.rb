class Parents < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :parent_1_id, :bigint
    add_column :users, :parent_2_id, :bigint
    add_foreign_key :users, :users, column: :parent_1_id, primary_key: 'id'
    add_foreign_key :users, :users, column: :parent_2_id, primary_key: 'id'

    add_column :users, :name, :string
  end
end
