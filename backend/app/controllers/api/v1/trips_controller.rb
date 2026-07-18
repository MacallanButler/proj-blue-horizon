class Api::V1::TripsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]

  def index
    trips = Trip.all
    trips = trips.where(dive_site_id: params[:dive_site_id]) if params[:dive_site_id].present?
    trips = trips.where('date >= ?', params[:date_from]) if params[:date_from].present?
    trips = trips.where('date <= ?', params[:date_to]) if params[:date_to].present?

    if params[:min_cert_level].present?
      # Normalize cert level filtering
      val = Trip.required_cert_levels[params[:min_cert_level]] || params[:min_cert_level].to_i
      trips = trips.where('required_cert_level <= ?', val)
    end

    response_data = trips.map do |trip|
      booked = trip.bookings.where(status: [:confirmed, :completed]).count
      remaining_capacity = [0, trip.capacity - booked].max
      format_trip(trip, remaining_capacity)
    end

    render json: response_data
  end

  def show
    trip = Trip.find(params[:id])
    booked = trip.bookings.where(status: [:confirmed, :completed]).count
    remaining_capacity = [0, trip.capacity - booked].max
    render json: format_trip(trip, remaining_capacity)
  end

  def create
    trip = Trip.new(trip_params)
    authorize trip
    if trip.save
      render json: trip, status: :created
    else
      render json: { error: trip.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    trip = Trip.find(params[:id])
    authorize trip
    if trip.update(trip_params)
      render json: trip
    else
      render json: { error: trip.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def destroy
    trip = Trip.find(params[:id])
    authorize trip
    trip.destroy
    head :no_content
  end

  private

  def trip_params
    params.require(:trip).permit(:dive_site_id, :date, :departure_time, :capacity, :required_cert_level)
  end

  def format_trip(trip, remaining)
    {
      id: trip.id,
      diveSiteId: trip.dive_site_id,
      diveSiteName: trip.dive_site.name,
      date: trip.date,
      departureTime: trip.departure_time,
      capacity: trip.capacity,
      spotsRemaining: remaining,
      requiredCertLevel: trip.required_cert_level
    }
  end
end
