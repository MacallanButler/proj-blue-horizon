class LogEntry < ApplicationRecord
  belongs_to :user
  belongs_to :booking, optional: true

  validates :site_name, presence: true
  validates :date, presence: true
  validates :depth, presence: true, numericality: { greater_than: 0 }
  validates :duration, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :water_temp, presence: true, numericality: { only_integer: true }
  validates :visibility, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
