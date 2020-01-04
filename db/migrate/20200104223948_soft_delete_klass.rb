class SoftDeleteKlass < ActiveRecord::Migration[5.2]
  def up
    add_column :klasses, :soft_delete, :boolean, :default => false
  end

  def down
    remove_column :klasses, :soft_delete
  end
end
