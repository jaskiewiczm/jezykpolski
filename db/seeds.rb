# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

u = User.new
u.email = 'jaskiemr@gmail.com'
u.password = 'password'
u.password_confirmation = 'password'
u.save!

b = Book.new
b.title = 'Don Quixote'
b.author = 'Miguel de Cervantes'
b.save!

k = Klass.new
k.name = 'Lego'
k.save!

c1 = CalendarEntry.new
c1.assignment_text = 'Learn ABCs'
c1.date = Date.today
c1.klass_id = k.id
c1.save!

c1 = CalendarEntry.new
c1.assignment_text = 'Learn XYZs'
c1.date = Date.today
c1.klass_id = k.id
c1.save!

c1 = CalendarEntry.new
c1.assignment_text = 'Learn 123s'
c1.date = Date.today
c1.klass_id = k.id
c1.save!

h1 = Homework.new
h1.due_date = Date.today
h1.description = 'Do the assignment'
h1.save!

h2 = Homework.new
h2.due_date = Date.tomorrow
h2.description = 'Optional assignment'
h2.save!

h3 = Homework.new
h3.due_date = Date.yesterday
h3.description = 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of light, it was the season of darkness, it was the spring of hope, it was the winter of despair.'
h3.save!
