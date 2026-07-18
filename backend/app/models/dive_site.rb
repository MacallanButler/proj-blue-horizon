class DiveSite < ApplicationRecord
  has_many :trips, dependent: :destroy

  serialize :marine_life, type: Array, coder: JSON
  serialize :best_months, type: Array, coder: JSON
  serialize :features, type: Array, coder: JSON

  validates :name, presence: true, uniqueness: true
  validates :location, presence: true
  validates :country, presence: true
  validates :lat, presence: true
  validates :lng, presence: true
end
