desc "Add Class"
task :add_class do
  emails = []

  emails.each do |email|
    u = User.new
    u.email = email
    u.password = 'Ferdynand'
    u.password_confirmation = 'Ferdynand'
    u.save!
  end
end