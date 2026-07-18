class UserPolicy < ApplicationPolicy
  def cert?
    user.present? && record.id == user.id
  end

  def verify_cert?
    staff?
  end

  def role?
    admin?
  end

  def show_cert_photo?
    staff? || (user.present? && record.id == user.id)
  end
end
