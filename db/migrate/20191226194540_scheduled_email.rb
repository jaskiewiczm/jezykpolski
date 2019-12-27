class ScheduledEmail < ActiveRecord::Migration[5.2]
  def up
    add_column :jezyk_polski_emails, :scheduled_at, :datetime
    rename_column :jezyk_polski_emails, :sent_at, :completed_at
  end

  def down
    remove_column :jezyk_polski_emails, :scheduled_at
    rename_column :jezyk_polski_emails, :completed_at, :sent_at
  end
end
