class UserRelationships < ActiveRecord::Migration[5.2]
  def up
    create_table 'user_users', force: true do |t|
      t.bigint 'parent_id'
      t.bigint 'child_id'
      t.timestamps
    end

    add_foreign_key :user_users, :users, column: :parent_id, primary_key: 'id'
    add_foreign_key :user_users, :users, column: :child_id, primary_key: 'id'
  end

  def down
    drop_table :user_users
  end
end
