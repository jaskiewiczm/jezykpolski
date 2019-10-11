class ExpandColumn < ActiveRecord::Migration[5.2]
  def change
    if Rails.env.production?
      ActiveRecord::Base.connection.execute('alter table homeworks alter description type varchar(4096)')
    else
      ActiveRecord::Base.connection.execute('alter table homeworks modify description varchar(4096)')
    end
  end
end
