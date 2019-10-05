# frozen_string_literal: true

class Roles < ActiveRecord::Migration[5.2]
  def up
    create_table 'roles', force: true do |t|
      t.string 'name'
      t.timestamps
    end

    create_table 'user_roles', force: true do |t|
      t.integer 'user_id'
      t.integer 'role_id'
      t.timestamps
    end
  end
end
