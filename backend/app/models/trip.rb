class Trip < ApplicationRecord
  belongs_to :dive_site
  has_many :bookings, dependent: :destroy

  enum :required_cert_level, { open_water: 0, advanced: 1, rescue: 2, divemaster: 3, instructor: 4 }

  validates :date, presence: true
  validates :departure_time, presence: true
  validates :capacity, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :required_cert_level, presence: true
end
