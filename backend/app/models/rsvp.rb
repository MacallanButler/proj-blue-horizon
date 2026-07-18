class Rsvp < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :conservation_event

  validates :guest_name, :guest_email, presence: true, if: -> { user_id.nil? }
  validate :event_has_remaining_capacity, on: :create

  private

  def event_has_remaining_capacity
    return unless conservation_event

    if conservation_event.rsvps.count >= conservation_event.capacity
      errors.add(:base, "This event has reached its maximum capacity of RSVPs.")
    end
  end
end
