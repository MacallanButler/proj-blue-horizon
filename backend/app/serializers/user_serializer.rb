class UserSerializer
  def initialize(user)
    @user = user
  end

  def as_json
    return nil if @user.nil?
    {
      id: @user.id,
      email: @user.email,
      name: @user.name,
      phone: @user.phone,
      role: @user.role,
      padiCertNumber: @user.padi_cert_number,
      padiCertLevel: @user.padi_cert_level,
      certVerifiedByStaff: @user.cert_verified_by_staff,
      certCardPhotoUrl: @user.cert_card_photo.attached? ? Rails.application.routes.url_helpers.rails_blob_url(@user.cert_card_photo, only_path: true) : nil
    }
  end
end
