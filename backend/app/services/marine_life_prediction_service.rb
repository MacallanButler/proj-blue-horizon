class MarineLifePredictionService
  CURRENT_STRENGTH_SCORE = {
    "None" => 10,
    "Mild" => 30,
    "Moderate" => 60,
    "Strong" => 85,
    "Extreme" => 100
  }.freeze

  SPECIES_PREFERENCES = {
    "Grey Reef Sharks" => { preferred_current_min: 60, preferred_temp_min: 24, preferred_temp_max: 30, depth_min: 15 },
    "Manta Rays" => { preferred_current_min: 20, preferred_temp_min: 20, preferred_temp_max: 29, depth_min: 5 },
    "Whale Sharks" => { preferred_current_min: 0, preferred_temp_min: 26, preferred_temp_max: 30, depth_min: 0 },
    "Sea Turtles" => { preferred_current_min: 0, preferred_temp_min: 22, preferred_temp_max: 30, depth_min: 5 },
    "Barracudas" => { preferred_current_min: 60, preferred_temp_min: 24, preferred_temp_max: 30, depth_min: 8 },
    "Eagle Rays" => { preferred_current_min: 30, preferred_temp_min: 24, preferred_temp_max: 29, depth_min: 10 },
    "Turtles" => { preferred_current_min: 0, preferred_temp_min: 22, preferred_temp_max: 30, depth_min: 5 },
    "Giant Groupers" => { preferred_current_min: 20, preferred_temp_min: 22, preferred_temp_max: 29, depth_min: 10 }
  }.freeze

  def initialize(dive_site)
    @dive_site = dive_site
  end

  # predict expects 0-indexed month (0-11, e.g. 0 = January)
  def predict(month = Time.current.month - 1)
    current_score = CURRENT_STRENGTH_SCORE[@dive_site.current_strength] || 0
    avg_temp = (@dive_site.temperature_min + @dive_site.temperature_max) / 2.0
    month_score = score_month(month, @dive_site.best_months || [])
    peak_season = (@dive_site.best_months || []).include?(month)

    (@dive_site.marine_life || []).map do |species|
      prefs = SPECIES_PREFERENCES[species]
      likelihood_score = month_score

      if prefs
        temp_in_range = avg_temp >= prefs[:preferred_temp_min] && avg_temp <= prefs[:preferred_temp_max]
        likelihood_score *= 0.5 unless temp_in_range

        current_ok = current_score >= prefs[:preferred_current_min]
        likelihood_score *= 0.6 unless current_ok

        depth_ok = @dive_site.depth_max >= prefs[:depth_min]
        likelihood_score *= 0.4 unless depth_ok
      end

      clamped = [5, [98, likelihood_score.round].min].max
      {
        species: species,
        likelihood: clamped,
        peakSeason: peak_season,
        note: get_note(clamped, peak_season)
      }
    end
  end

  private

  def score_month(month, best_months)
    return 100 if best_months.include?(month)

    prev_month = (month - 1 + 12) % 12
    next_month = (month + 1) % 12
    return 55 if best_months.include?(prev_month) || best_months.include?(next_month)

    15
  end

  def get_note(likelihood, peak_season)
    if likelihood >= 80
      peak_season ? "Peak season — sightings almost guaranteed." : "Excellent conditions for sightings."
    elsif likelihood >= 60
      "Good chance of sighting if you dive the right spots."
    elsif likelihood >= 40
      "Possible — conditions are marginal for this species."
    else
      "Low likelihood — off-season or unsuitable conditions."
    end
  end
end
