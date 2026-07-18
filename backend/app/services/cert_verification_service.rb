class CertVerificationService
  class InsufficientCertificationError < StandardError; end

  def initialize(user, trip)
    @user = user
    @trip = trip
  end

  def verify!
    required_level_name = @trip.required_cert_level
    required_level_value = Trip.required_cert_levels[required_level_name]

    # Open water/beginner trips are open to everyone (even without registered certs)
    return { verified: true, needs_staff_review: false } if required_level_value <= Trip.required_cert_levels[:open_water]

    if @user.nil?
      raise InsufficientCertificationError, "Guests can only book beginner (Open Water) trips. Please register to book advanced trips."
    end

    user_level_name = @user.padi_cert_level
    if user_level_name.nil?
      raise InsufficientCertificationError, "No PADI certification on file. This site requires #{required_level_name.titleize}."
    end

    user_level_value = User.padi_cert_levels[user_level_name]
    if user_level_value < required_level_value
      raise InsufficientCertificationError, "Your certification level (#{user_level_name.titleize}) is insufficient. Requires #{required_level_name.titleize}."
    end

    { verified: true, needs_staff_review: !@user.cert_verified_by_staff }
  end
end
