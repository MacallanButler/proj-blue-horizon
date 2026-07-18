class BookingPolicy < ApplicationPolicy
  def index?
    staff?
  end

  def show?
    staff? || (user.present? && record.user_id == user.id)
  end

  def create?
    true
  end

  def update?
    staff?
  end

  def destroy?
    staff?
  end

  def mine?
    user.present?
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
