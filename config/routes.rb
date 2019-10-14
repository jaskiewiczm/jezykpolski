Jezykpolski::Application.routes.draw do
  root 'application#index'

  post '/login' => 'login#login'
  post '/logout' => 'login#logout'
  get '/whoami' => 'login#whoami'

  devise_for :users, only: []

  get '/homeworks' => 'homeworks#index'
  get '/get_homeworks' => 'homeworks#homework'

  post '/delete_homework' => 'homeworks#delete_homework'
  post 'update_homework_description' => 'homeworks#update_homework_description'

end
