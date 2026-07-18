class Api::V1::ImpactStatsController < ApplicationController
  def show
    stat = ImpactStat.current
    render json: {
      coralFragmentsPlanted: stat.coral_fragments_planted,
      co2OffsetKg: stat.co2_offset_kg,
      marineAnimalsTagged: stat.marine_animals_tagged,
      conservationFundCents: stat.conservation_fund_cents
    }
  end
end
