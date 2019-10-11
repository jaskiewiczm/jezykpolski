Jezykpolski::Application.routes.draw do
  root 'application#index'

  get '/homeworks' => 'homeworks#index'
  get '/get_homeworks' => 'homeworks#homework'

  post '/login' => 'login#login'
  post '/logout' => 'login#logout'
end
