class Api::V1::LogEntriesController < ApplicationController
  before_action :authenticate_user!

  def index
    log_entries = policy_scope(LogEntry)
    render json: log_entries.map { |l| format_log_entry(l) }
  end

  def create
    log_entry = LogEntry.new(log_entry_params)
    log_entry.user = current_user
    
    authorize log_entry

    if log_entry.save
      render json: format_log_entry(log_entry), status: :created
    else
      render json: { error: log_entry.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    log_entry = LogEntry.find(params[:id])
    authorize log_entry
    if log_entry.update(log_entry_params)
      render json: format_log_entry(log_entry)
    else
      render json: { error: log_entry.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def destroy
    log_entry = LogEntry.find(params[:id])
    authorize log_entry
    log_entry.destroy
    head :no_content
  end

  private

  def log_entry_params
    params.require(:log_entry).permit(
      :booking_id, :site_name, :date, :depth, :duration,
      :water_temp, :visibility, :highlights
    )
  end

  def format_log_entry(log_entry)
    {
      id: log_entry.id,
      userId: log_entry.user_id,
      bookingId: log_entry.booking_id,
      site: log_entry.site_name,
      date: log_entry.date,
      depth: "#{log_entry.depth}m",
      duration: "#{log_entry.duration} min",
      waterTemp: "#{log_entry.water_temp}°C",
      visibility: "#{log_entry.visibility}m",
      highlights: log_entry.highlights
    }
  end
end
