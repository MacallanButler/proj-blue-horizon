class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!, except: [:guest_upgrade]

  def me
    render json: UserSerializer.new(current_user).as_json
  end

  def guest_upgrade
    # Register guest user
    user = User.new(guest_upgrade_params)
    user.role = :diver
    if user.save
      # Upgrade previous guest bookings & rsvps
      Booking.where(guest_email: user.email, user_id: nil).update_all(user_id: user.id)
      Rsvp.where(guest_email: user.email, user_id: nil).update_all(user_id: user.id)

      # Generate JWT token manually
      token, _payload = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)
      response.set_header('Authorization', "Bearer #{token}")

      render json: {
        status: { code: 200, message: 'Guest account upgraded successfully.' },
        data: UserSerializer.new(user).as_json
      }, status: :ok
    else
      render json: { error: user.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update_cert
    user = current_user
    authorize user, :cert?
    if user.update(cert_params.merge(cert_verified_by_staff: false))
      render json: { message: 'Certification submitted for staff review.', user: UserSerializer.new(user).as_json }
    else
      render json: { error: user.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def cert_photo
    user = User.find(params[:id])
    authorize user, :show_cert_photo?
    if user.cert_card_photo.attached?
      # Return direct signed URL or redirect
      # Using Active Storage disk url or redirect_to
      redirect_to Rails.application.routes.url_helpers.rails_blob_url(user.cert_card_photo, only_path: true), allow_other_host: true
    else
      render json: { error: 'No certification card photo uploaded.' }, status: :not_found
    end
  end

  def verify_cert
    user = User.find(params[:id])
    authorize User, :verify_cert?
    if user.update(cert_verified_by_staff: params[:verified])
      render json: { message: "Certification status updated.", user: UserSerializer.new(user).as_json }
    else
      render json: { error: user.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update_role
    user = User.find(params[:id])
    authorize User, :role?
    if user.update(role: params[:role])
      render json: { message: "User role updated to #{user.role}.", user: UserSerializer.new(user).as_json }
    else
      render json: { error: user.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def guest_upgrade_params
    params.require(:user).permit(:email, :password, :name, :phone)
  end

  def cert_params
    params.permit(:padi_cert_number, :padi_cert_level, :cert_card_photo)
  end
end
