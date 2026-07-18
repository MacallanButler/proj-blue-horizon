class Api::V1::BookingsController < ApplicationController
  before_action :authenticate_user!, only: [:index, :show, :mine, :update, :destroy]

  def index
    authorize Booking
    render json: Booking.all.map { |b| format_booking(b) }
  end

  def show
    booking = Booking.find(params[:id])
    authorize booking
    render json: format_booking(booking)
  end

  def mine
    authorize Booking, :mine?
    bookings = Booking.where(user_id: current_user.id)
    render json: bookings.map { |b| format_booking(b) }
  end

  def create
    trip = Trip.find(booking_params[:trip_id])

    # 1. Check Capacity Lock
    begin
      TripAvailabilityService.new(trip).check_availability!(1)
    rescue TripAvailabilityService::CapacityExceededError => e
      return render json: { error: e.message }, status: :unprocessable_entity
    end

    # 2. Check Cert Verification
    begin
      user_to_check = current_user || (booking_params[:user_id].present? ? User.find_by(id: booking_params[:user_id]) : nil)
      CertVerificationService.new(user_to_check, trip).verify!
    rescue CertVerificationService::InsufficientCertificationError => e
      return render json: { error: e.message }, status: :unprocessable_entity
    end

    # 3. Create Booking
    booking = Booking.new(booking_params)
    booking.user = current_user if current_user.present?
    booking.status = :pending_payment
    booking.conservation_fee_cents = 1000 # flat mandatory fee ($10)

    if booking.save
      render json: format_booking(booking), status: :created
    else
      render json: { error: booking.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def payment_intent
    booking = Booking.find(params[:id])
    
    # Mock payment intent generation
    mock_pi_id = "mock_pi_#{SecureRandom.hex(16)}"
    booking.update!(stripe_payment_intent_id: mock_pi_id)

    # Immediately simulate payment success in development/mock mode to avoid webhook bottlenecks
    # Change status to confirmed
    booking.update!(status: :confirmed)

    # Trigger nightly stats calculation to update counters instantly in dev mode
    ImpactStatsCalculator.calculate!

    render json: {
      clientSecret: "mock_src_secret_#{SecureRandom.hex(24)}",
      paymentIntentId: mock_pi_id,
      booking: format_booking(booking)
    }
  end

  def update
    booking = Booking.find(params[:id])
    authorize booking
    if booking.update(booking_params)
      render json: format_booking(booking)
    else
      render json: { error: booking.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def destroy
    booking = Booking.find(params[:id])
    authorize booking
    booking.destroy
    head :no_content
  end

  private

  def booking_params
    params.require(:booking).permit(
      :trip_id, :user_id, :guest_name, :guest_email, :guest_phone,
      :conservation_fee_cents, :total_cents, :status,
      gear_selections: [], extras: []
    )
  end

  def format_booking(booking)
    {
      id: booking.id,
      userId: booking.user_id,
      tripId: booking.trip_id,
      tripDate: booking.trip.date,
      tripTime: booking.trip.departure_time,
      diveSiteName: booking.trip.dive_site.name,
      guestName: booking.guest_name,
      guestEmail: booking.guest_email,
      guestPhone: booking.guest_phone,
      gearSelections: booking.gear_selections || [],
      extras: booking.extras || [],
      conservationFeeCents: booking.conservation_fee_cents,
      totalCents: booking.total_cents,
      status: booking.status,
      stripePaymentIntentId: booking.stripe_payment_intent_id,
      createdAt: booking.created_at
    }
  end
end
