class Documents < ActiveRecord::Migration[5.2]
  def up
    create_table 'documents', force: true do |t|
      t.string 'name'
      t.integer 'klass_id'
      t.timestamps
    end

  end
end
