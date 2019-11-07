Jezykpolski::Application.routes.draw do
  root 'application#index'

  post '/login' => 'login#login'
  post '/logout' => 'login#logout'
  get '/whoami' => 'login#whoami'

  devise_for :users, only: []

  get '/homeworks' => 'homeworks#index'
  post '/get_homeworks' => 'homeworks#homework'
  post '/add_homework' => 'homeworks#add_homework'
  post '/delete_homework' => 'homeworks#delete_homework'
  post '/update_homework_description' => 'homeworks#update_homework_description'

  get '/users' => 'users#index'
  get '/get_users' => 'users#users'
  post '/add_user' => 'users#add_user'
  post '/delete_user' => 'users#delete_user'
  post '/update_user' => 'users#update_user'

  get '/get_schools' => 'schools#get_schools'

  post '/get_klasses' => 'klasses#get_klasses'
  get '/klasses' => 'klasses#index'
  post '/update_klass' => 'klasses#update'
  post '/add_klass' => 'klasses#add'
  post '/delete_klass' => 'klasses#delete'

  post '/get_enrollments' => 'enrollments#get_enrollments'
  post '/add_enrollment' => 'enrollments#add_enrollment'
  post '/delete_enrollment' => 'enrollments#delete_enrollment'

  get '/gradebook' => 'gradebooks#index'


end
