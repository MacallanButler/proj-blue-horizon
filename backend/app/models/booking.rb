class Booking < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :trip
  has_one :log_entry

  serialize :gear_selections, type: Array, coder: JSON
  serialize :extras, type: Array, coder: JSON

  enum :status, { pending_payment: 0, confirmed: 1, completed: 2, cancelled: 3 }, default: :pending_payment

  validates :conservation_fee_cents, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :total_cents, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :status, presence: true

  # Guest fields validation
  validates :guest_name, :guest_email, :guest_phone, presence: true, if: -> { user_id.nil? }

  # Certification validation
  validate :user_or_guest_has_required_cert_level, on: :create

  private

  def user_or_guest_has_required_cert_level
    return unless trip

    required_level_name = trip.required_cert_level
    required_level_value = Trip.required_cert_levels[required_level_name]

    if user_id.nil?
      # Guest bookings only allowed if site is open_water (beginner) level
      if required_level_value > Trip.required_cert_levels[:open_water]
        errors.add(:base, "Guests can only book beginner (Open Water) trips. Please log in to book advanced trips.")
      end
    else
      # User bookings: check cert level
      # If cert is not verified, we still let them book but it will be flagged (per technical brief:
      # "if cert_verified_by_staff is false, still allow booking but flag it for staff review before the trip date")
      user_level_name = user.padi_cert_level
      if user_level_name.nil?
        # No cert on file
        if required_level_value > Trip.required_cert_levels[:open_water]
          errors.add(:base, "You do not have a PADI certification on file required for this site.")
        end
      else
        user_level_value = User.padi_cert_levels[user_level_name]
        if user_level_value < required_level_value
          errors.add(:base, "Your PADI certification level (#{user_level_name.titleize}) is insufficient for this site (requires #{required_level_name.titleize}).")
        end
      end
    end
  end
end
