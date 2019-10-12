Jezykpolski::Application.routes.draw do
  root 'application#index'

  post '/login' => 'login#login'
  post '/logout' => 'login#logout'

  devise_for :users, only: []

  get '/homeworks' => 'homeworks#index'
  get '/get_homeworks' => 'homeworks#homework'

end
