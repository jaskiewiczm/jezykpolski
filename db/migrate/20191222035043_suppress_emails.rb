class SuppressEmails < ActiveRecord::Migration[5.2]
  def up
    add_column :users, :suppress_grades_emails, :boolean, :default => false
  end

  def down
    remove_column :users, :suppress_grades_emails
  end
end
