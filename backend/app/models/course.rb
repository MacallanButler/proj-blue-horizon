class Course < ApplicationRecord
  has_many :course_enrollments, dependent: :destroy

  enum :level, { beginner: 0, continuing: 1, professional: 2 }

  validates :title, presence: true, uniqueness: true
  validates :level, presence: true
  validates :duration_days, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :price_cents, presence: true, numericality: { only_integer: true, greater_than: 0 }
end
