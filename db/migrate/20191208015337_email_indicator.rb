class EmailIndicator < ActiveRecord::Migration[5.2]
  def up
    create_table :emails do |t|
      t.bigint :emailable_id
      t.string :emailable_type
      t.timestamps
    end
  end

  def down
    drop_table :emails
  end
end
