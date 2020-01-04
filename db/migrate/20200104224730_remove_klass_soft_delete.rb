class RemoveKlassSoftDelete < ActiveRecord::Migration[5.2]
  def up
    remove_column :klasses, :soft_delete
  end
end
