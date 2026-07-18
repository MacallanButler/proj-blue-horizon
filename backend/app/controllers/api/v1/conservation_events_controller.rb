class Api::V1::ConservationEventsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]

  def index
    events = ConservationEvent.all
    render json: events.map { |e| format_event(e) }
  end

  def show
    event = ConservationEvent.find(params[:id])
    render json: format_event(event)
  end

  def create
    event = ConservationEvent.new(event_params)
    authorize event
    if event.save
      render json: format_event(event), status: :created
    else
      render json: { error: event.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    event = ConservationEvent.find(params[:id])
    authorize event
    if event.update(event_params)
      render json: format_event(event)
    else
      render json: { error: event.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def destroy
    event = ConservationEvent.find(params[:id])
    authorize event
    event.destroy
    head :no_content
  end

  private

  def event_params
    params.require(:conservation_event).permit(:title, :description, :event_type, :date, :location, :capacity)
  end

  def format_event(event)
    {
      id: event.id,
      title: event.title,
      description: event.description,
      eventType: event.event_type,
      date: event.date,
      location: event.location,
      capacity: event.capacity,
      spotsRemaining: [0, event.capacity - event.rsvps.count].max
    }
  end
end
