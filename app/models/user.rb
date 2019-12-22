# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  belongs_to :school
  has_many :user_roles
  has_many :reading_logs
  has_many :user_klasses
  has_many :klasses, :through => :user_klasses do
   def active
     where("user_klasses.soft_unenrolled = ?", 0)
   end
  end
  has_many :roles, through: :user_roles
  has_many :books, through: :reading_logs
  has_many :bills

  has_many :parent_users, foreign_key: :child_id, class_name: 'UserUser'
  has_many :parents, through: :parent_users
  has_many :child_users, foreign_key: :parent_id, class_name: 'UserUser'
  has_many :children, through: :child_users
  has_many :taught_klasses, foreign_key: :teacher_id, class_name: 'Klass'

  belongs_to :grade_level

  def is_school_admin?
    return self.roles.where(:code => 'school_admin').count == 1
  end

  def is_teacher?
    return self.roles.where(:code => 'teacher').count == 1
  end

  def is_parent?
    return self.roles.where(:code => 'parent').count == 1
  end

  def is_student?
    return self.roles.where(:code => 'student').count == 1
  end

  def is_admin?
    return self.roles.where('code like ?', '%admin%').count > 0
  end

  def emailable_users
    users = [self]

    if is_student?
      users = users + parents
    end

    users
  end

  protected
  def email_required?
    false
  end

end
