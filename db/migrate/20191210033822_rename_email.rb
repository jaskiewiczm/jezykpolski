class RenameEmail < ActiveRecord::Migration[5.2]
  def change
    rename_table :emails, :jezyk_polski_emails
  end
end
