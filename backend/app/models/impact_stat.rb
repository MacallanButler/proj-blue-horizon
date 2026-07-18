class ImpactStat < ApplicationRecord
  validates :coral_fragments_planted, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :co2_offset_kg, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :marine_animals_tagged, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :conservation_fund_cents, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  def self.current
    first_or_create!(
      coral_fragments_planted: 0,
      co2_offset_kg: 0,
      marine_animals_tagged: 0,
      conservation_fund_cents: 0
    )
  end
end
