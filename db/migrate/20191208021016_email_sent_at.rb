class EmailSentAt < ActiveRecord::Migration[5.2]
  def up
    add_column :emails, :sent_at, :datetime
  end

  def down
    remove_column :emails, :sent_at
  end
end
