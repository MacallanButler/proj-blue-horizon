class CourseEnrollment < ApplicationRecord
  belongs_to :user
  belongs_to :course

  enum :status, { pending_deposit: 0, enrolled: 1, completed: 2, cancelled: 3 }, default: :pending_deposit

  validates :deposit_paid_cents, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :balance_due_cents, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :status, presence: true
end
