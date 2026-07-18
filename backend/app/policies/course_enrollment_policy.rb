class CourseEnrollmentPolicy < ApplicationPolicy
  def index?
    staff?
  end

  def show?
    staff? || (user.present? && record.user_id == user.id)
  end

  def create?
    user.present?
  end

  def update?
    staff?
  end

  def destroy?
    staff?
  end

  class Scope < Scope
    def resolve
      if user.nil?
        scope.none
      elsif user.staff? || user.admin?
        scope.all
      else
        scope.where(user_id: user.id)
      end
    end
  end
end
