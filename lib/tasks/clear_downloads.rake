namespace :clear_downloads do
  desc 'Clear downloads folder'
  task clear: :environment do
    path = "public/downloads"
    FileUtils.rm_rf(path)
    FileUtils.mkdir_p(path)
  end
end