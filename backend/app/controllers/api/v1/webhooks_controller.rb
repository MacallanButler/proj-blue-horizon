class Api::V1::WebhooksController < ApplicationController
  # Skip authenticity token or authentication since Stripe requests this publicly
  # We do not authenticate user for webhooks!

  def stripe
    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    event = nil

    if Rails.env.production? || sig_header.present?
      begin
        endpoint_secret = ENV['STRIPE_WEBHOOK_SECRET']
        event = Stripe::Webhook.construct_event(payload, sig_header, endpoint_secret)
      rescue JSON::ParserError => e
        return render json: { error: 'Invalid payload' }, status: :bad_request
      rescue Stripe::SignatureVerificationError => e
        return render json: { error: 'Invalid signature' }, status: :bad_request
      end
    else
      # Mock mode for local testing without signature
      begin
        event_data = JSON.parse(payload, symbolize_names: true)
        event = OpenStruct.new(
          type: event_data[:type],
          data: OpenStruct.new(object: OpenStruct.new(event_data[:data][:object]))
        )
      rescue => e
        return render json: { error: "Failed to parse mock webhook: #{e.message}" }, status: :bad_request
      end
    end

    # Handle the event
    case event.type
    when 'payment_intent.succeeded'
      payment_intent = event.data.object
      handle_payment_intent_succeeded(payment_intent)
    end

    head :ok
  end

  private

  def handle_payment_intent_succeeded(payment_intent)
    pi_id = payment_intent.id
    
    # 1. Check Bookings
    booking = Booking.find_by(stripe_payment_intent_id: pi_id)
    if booking
      booking.update!(status: :confirmed)
      ImpactStatsCalculator.calculate!
      return
    end

    # 2. Check CourseEnrollments (deposit)
    enrollment = CourseEnrollment.find_by(stripe_payment_intent_id: pi_id)
    if enrollment
      enrollment.update!(status: :enrolled)
      ImpactStatsCalculator.calculate!
      return
    end

    # 3. Check CourseEnrollments (balance)
    enrollment_balance = CourseEnrollment.find_by(stripe_balance_intent_id: pi_id)
    if enrollment_balance
      enrollment_balance.update!(status: :completed)
      ImpactStatsCalculator.calculate!
      return
    end
  end
end
