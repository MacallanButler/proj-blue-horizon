class ConservationEvent < ApplicationRecord
  has_many :rsvps, dependent: :destroy

  enum :event_type, { cleanup: 0, restoration: 1, workshop: 2 }

  validates :title, presence: true
  validates :description, presence: true
  validates :event_type, presence: true
  validates :date, presence: true
  validates :location, presence: true
  validates :capacity, presence: true, numericality: { only_integer: true, greater_than: 0 }
end
