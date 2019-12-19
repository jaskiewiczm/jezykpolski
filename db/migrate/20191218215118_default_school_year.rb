class DefaultSchoolYear < ActiveRecord::Migration[5.2]
  def up
    sy = SchoolYear.new
    sy.period = '2019 - 2020'
    sy.default_tuition = 1000.00
    sy.save!
  end

  def down
    SchoolYear.all.destroy!
  end
end
