Jezykpolski::Application.routes.draw do
  root 'application#index'
  get '/login' => 'login#index'
  get '/homeworks' => 'homeworks#index'
  get '/get_homeworks' => 'homeworks#homework'
end
