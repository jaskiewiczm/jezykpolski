# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :user_roles
  has_many :reading_logs
  has_many :user_klasses
  #has_many :klasses, -> { where(UserKlass.soft_unenrolled: 0) }, :through => :user_klasses
  has_many :klasses, :through => :user_klasses do
   def active
     where("user_klasses.soft_unenrolled = ?", 0)
   end
  end
  has_many :roles, through: :user_roles
  has_many :books, through: :reading_logs

  has_many :parent_users, foreign_key: :child_id, class_name: 'UserUser'
  has_many :parents, through: :parent_users
  has_many :child_users, foreign_key: :parent_id, class_name: 'UserUser'
  has_many :children, through: :child_users

end
