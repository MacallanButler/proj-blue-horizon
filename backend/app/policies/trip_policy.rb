class TripPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    staff?
  end

  def update?
    staff?
  end

  def destroy?
    staff?
  end
end
