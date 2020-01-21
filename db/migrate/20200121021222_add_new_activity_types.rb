class AddNewActivityTypes < ActiveRecord::Migration[5.2]
  def up
  	at1 = ActivityType.create(:name => 'Presentation', :code => 'presentation')
  	at2 = ActivityType.create(:name => 'Participation', :code => 'participation')
  	at3 = ActivityType.create(:name => 'Systematic', :code => 'systematic')
  	klasses = Klass.all

  	klasses.each do |k|
  		k.activity_types.append(at1)
  		k.activity_types.append(at2)
  		k.activity_types.append(at3)
  	end
  end

  def down
  end
end
