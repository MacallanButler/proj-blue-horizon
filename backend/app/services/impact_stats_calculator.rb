class ImpactStatsCalculator
  def self.calculate!
    stat = ImpactStat.current

    # 1. Conservation Fund (sum of conservation_fee_cents from confirmed or completed bookings)
    stat.conservation_fund_cents = Booking.where(status: [:confirmed, :completed]).sum(:conservation_fee_cents)

    # 2. Coral Fragments Planted (attended RSVPs for restoration events * 5 fragments per participant)
    restoration_rsvps = Rsvp.joins(:conservation_event)
                            .where(attended: true)
                            .where(conservation_events: { event_type: :restoration })
                            .count
    stat.coral_fragments_planted = restoration_rsvps * 5

    # 3. Marine Animals Tagged (attended RSVPs for workshops/cleanups * 2 animals recorded/tagged per participant)
    monitoring_rsvps = Rsvp.joins(:conservation_event)
                           .where(attended: true)
                           .where(conservation_events: { event_type: [:cleanup, :workshop] })
                           .count
    stat.marine_animals_tagged = monitoring_rsvps * 2

    # 4. CO2 Offset (completed bookings * 12 kg CO2 offset from boat efficiency/offsets)
    completed_bookings = Booking.where(status: :completed).count
    stat.co2_offset_kg = completed_bookings * 12

    stat.save!
    stat
  end
end
