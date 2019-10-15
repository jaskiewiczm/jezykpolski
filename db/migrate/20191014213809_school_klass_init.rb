class SchoolKlassInit < ActiveRecord::Migration[5.2]
  def change
    s = School.new
    s.name = 'Polska Szkoła Katolicka im Św Ferdynanda'
    s.save!

    k = Klass.new
    k.name = 'Klasa 9 - Język Polski'
    k.school_id = s.id
    k.save!
  end
end
