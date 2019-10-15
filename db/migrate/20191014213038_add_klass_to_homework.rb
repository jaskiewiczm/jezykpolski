class AddKlassToHomework < ActiveRecord::Migration[5.2]
  def change
    create_table 'schools', force: true do |t|
      t.string 'name'
      t.timestamps
    end

    add_column :homeworks, :klass_id, :bigint
    add_foreign_key :homeworks, :klasses, column: :klass_id, primary_key: 'id'
    add_column :klasses, :school_id, :bigint
    add_foreign_key :klasses, :schools, column: :school_id, primary_key: 'id'
  end
end
