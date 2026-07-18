class Api::V1::RsvpsController < ApplicationController
  before_action :authenticate_user!, only: [:index, :mine, :attendance]

  def index
    authorize Rsvp
    rsvps = Rsvp.all
    render json: rsvps.map { |r| format_rsvp(r) }
  end

  def mine
    authorize Rsvp, :mine?
    rsvps = Rsvp.where(user_id: current_user.id)
    render json: rsvps.map { |r| format_rsvp(r) }
  end

  def create
    event = ConservationEvent.find(rsvp_params[:conservation_event_id])
    rsvp = Rsvp.new(rsvp_params)
    rsvp.user = current_user if current_user.present?
    rsvp.attended = false

    authorize rsvp

    if rsvp.save
      # Re-trigger stats calculation (although attended is false, fund might need updating or just sync)
      ImpactStatsCalculator.calculate!
      render json: format_rsvp(rsvp), status: :created
    else
      render json: { error: rsvp.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def attendance
    rsvp = Rsvp.find(params[:id])
    authorize rsvp, :attendance?
    
    if rsvp.update(attended: params[:attended] == 'true')
      # Recompute stats nightly or on demand here for instant feedback
      ImpactStatsCalculator.calculate!
      render json: format_rsvp(rsvp)
    else
      render json: { error: rsvp.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def rsvp_params
    params.require(:rsvp).permit(:conservation_event_id, :guest_name, :guest_email)
  end

  def format_rsvp(rsvp)
    {
      id: rsvp.id,
      userId: rsvp.user_id,
      conservationEventId: rsvp.conservation_event_id,
      conservationEventTitle: rsvp.conservation_event.title,
      guestName: rsvp.guest_name,
      guestEmail: rsvp.guest_email,
      attended: rsvp.attended,
      createdAt: rsvp.created_at
    }
  end
end
