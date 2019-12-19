class ActualGradeLevels < ActiveRecord::Migration[5.2]
  def up
    levels = [
      ['3 Year', 0],
      ['4 Year', 1],
      ['0', 2],
      ['1', 3],
      ['2', 4],
      ['3', 5],
      ['4', 6],
      ['5', 7],
      ['6', 8],
      ['7', 9],
      ['8', 10],
      ['9', 11],
      ['10', 12],
      ['11', 13]
    ]

    levels.each do |level|
      g = GradeLevel.new
      g.level = level[0]
      g.level_integer = level[1]
      g.save!
    end

  end

  def down
  end
end
