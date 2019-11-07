class Gradebooks < ActiveRecord::Migration[5.2]
  def up
    create_table 'gradebooks', force: true do |t|
      t.integer 'klass_id'
      t.timestamps
    end
  end
end
