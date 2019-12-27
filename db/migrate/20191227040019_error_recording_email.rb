class ErrorRecordingEmail < ActiveRecord::Migration[5.2]
  def up
    add_column :jezyk_polski_emails, :response_status_code, :integer
    add_column :jezyk_polski_emails, :response_body, :string
  end

  def down
    remove_column :jezyk_polski_emails, :response_status_code
    remove_column :jezyk_polski_emails, :response_body
  end
end
