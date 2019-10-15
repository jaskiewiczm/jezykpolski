Jezykpolski::Application.routes.draw do
  root 'application#index'

  post '/login' => 'login#login'
  post '/logout' => 'login#logout'
  get '/whoami' => 'login#whoami'

  devise_for :users, only: []

  get '/homeworks' => 'homeworks#index'
  get '/get_homeworks' => 'homeworks#homework'

  post '/add_homework' => 'homeworks#add_homework'
  post '/delete_homework' => 'homeworks#delete_homework'
  post '/update_homework_description' => 'homeworks#update_homework_description'

  get '/students' => 'students#index'
  get '/get_students' => 'students#students'

  post '/add_student' => 'students#add_student'
  post '/delete_student' => 'students#delete_student'
  post '/update_student' => 'students#update_student'


end
