class Api::V1::CourseEnrollmentsController < ApplicationController
  before_action :authenticate_user!

  def index
    enrollments = policy_scope(CourseEnrollment)
    render json: enrollments.map { |e| format_enrollment(e) }
  end

  def show
    enrollment = CourseEnrollment.find(params[:id])
    authorize enrollment
    render json: format_enrollment(enrollment)
  end

  def create
    course = Course.find(course_enrollment_params[:course_id])
    enrollment = CourseEnrollment.new(course_enrollment_params)
    enrollment.user = current_user
    enrollment.status = :pending_deposit

    # Dynamic deposit calculation: $150 deposit unless course total is less
    total = course.price_cents
    deposit = [total, 15000].min
    balance = [0, total - deposit].max

    enrollment.deposit_paid_cents = deposit
    enrollment.balance_due_cents = balance

    authorize enrollment

    if enrollment.save
      # Instantly mock deposit payment in development to complete enrollment flow
      mock_dep_pi = "mock_dep_pi_#{SecureRandom.hex(16)}"
      enrollment.update!(stripe_payment_intent_id: mock_dep_pi, status: :enrolled)

      # Trigger stats updates
      ImpactStatsCalculator.calculate!

      render json: format_enrollment(enrollment), status: :created
    else
      render json: { error: enrollment.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    enrollment = CourseEnrollment.find(params[:id])
    authorize enrollment
    if enrollment.update(course_enrollment_params)
      render json: format_enrollment(enrollment)
    else
      render json: { error: enrollment.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def course_enrollment_params
    params.require(:course_enrollment).permit(:course_id, :status)
  end

  def format_enrollment(enrollment)
    {
      id: enrollment.id,
      userId: enrollment.user_id,
      courseId: enrollment.course_id,
      courseTitle: enrollment.course.title,
      courseLevel: enrollment.course.level,
      status: enrollment.status,
      depositPaidCents: enrollment.deposit_paid_cents,
      balanceDueCents: enrollment.balance_due_cents,
      stripePaymentIntentId: enrollment.stripe_payment_intent_id,
      stripeBalanceIntentId: enrollment.stripe_balance_intent_id,
      createdAt: enrollment.created_at
    }
  end
end
