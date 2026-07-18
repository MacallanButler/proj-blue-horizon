class LogEntryPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def show?
    user.present? && record.user_id == user.id
  end

  def create?
    user.present? && record.user_id == user.id
  end

  def update?
    user.present? && record.user_id == user.id
  end

  def destroy?
    user.present? && record.user_id == user.id
  end

  class Scope < Scope
    def resolve
      if user.nil?
        scope.none
      else
        scope.where(user_id: user.id)
      end
    end
  end
end
