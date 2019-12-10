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
  post '/students' => 'users#students'
  get '/get_users' => 'users#users'
  post '/add_user' => 'users#add_user'
  post '/delete_user' => 'users#delete_user'
  post '/update_user' => 'users#update_user'
  get '/get_user_roles' => 'users#get_user_roles'
  post '/password_reset' => 'users#password_reset'

  get '/get_schools' => 'schools#get_schools'

  post '/get_klasses' => 'klasses#get_klasses'
  get '/klasses' => 'klasses#index'
  post '/update_klass' => 'klasses#update'
  post '/add_klass' => 'klasses#add'
  post '/delete_klass' => 'klasses#delete'
  get '/download_enrollment/:gradebookId' => 'klasses#download'

  post '/get_enrolled_users' => 'enrollments#get_enrolled_users'
  post '/get_enrollments' => 'enrollments#get_enrollments'
  post '/add_enrollment' => 'enrollments#add_enrollment'
  post '/delete_enrollment' => 'enrollments#delete_enrollment'

  get '/gradebook' => 'gradebooks#index'
  post '/get_gradebook' => 'gradebooks#get_gradebook'
  post '/set_grade' => 'gradebooks#set_grade'
  get '/download_gradebook/:gradebookId' => 'gradebooks#download'
  post '/send_grade_emails' => 'gradebooks#send_grade_emails'

  post '/get_grading_scale' => 'grading_scales#get_grading_scale'

  get '/user_report' => 'user_reports#index'
  get '/get_user_report' => 'user_reports#get_user_report'

  get '/get_roles' => 'roles#get_roles'

end
