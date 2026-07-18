class CalculateImpactStatsJob < ApplicationJob
  queue_as :default

  def perform
    ImpactStatsCalculator.calculate!
  end
end
