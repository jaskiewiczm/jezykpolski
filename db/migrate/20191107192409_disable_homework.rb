class DisableHomework < ActiveRecord::Migration[5.2]
  def up
    add_column :homeworks, :disabled, :boolean, :default => 0
  end

  def down
    drop_column :homeworks, :disabled
  end
end
