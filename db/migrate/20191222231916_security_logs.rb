class SecurityLogs < ActiveRecord::Migration[5.2]
  def up
    create_table :security_logs, force: true do |t|
      t.string :error
      t.bigint :user_id
      t.timestamps
    end
  end

  def down
    drop_table :security_logs
  end
end
