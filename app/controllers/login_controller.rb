# frozen_string_literal: true

class LoginController < ApplicationController
  include Devise::Controllers::Helpers

  def login
    require 'pry'
    binding.pry
    #email = User.where(:email => )
    #sign_in
  end

  def logout

  end
end
