class TripAvailabilityService
  class CapacityExceededError < StandardError; end

  def initialize(trip)
    @trip = trip
  end

  def check_availability!(requested_spots = 1)
    @trip.with_lock do
      # Count confirmed or completed bookings
      # In this setup, we assume 1 spot per booking (single diver). If bookings support multiple divers, we would sum a spots/guests count.
      booked_spots = @trip.bookings.where(status: [:confirmed, :completed]).count
      remaining = @trip.capacity - booked_spots

      if remaining < requested_spots
        raise CapacityExceededError, "Trip capacity exceeded. Only #{remaining} spots remaining."
      end

      true
    end
  end
end
