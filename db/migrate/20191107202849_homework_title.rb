class HomeworkTitle < ActiveRecord::Migration[5.2]
  def up
    add_column :homeworks, :title, :string
  end

  def down
    drop_column :homeworks, :title
  end
end
