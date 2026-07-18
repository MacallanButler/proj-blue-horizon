class Api::V1::CoursesController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]

  def index
    courses = Course.all
    render json: courses.map { |c| format_course(c) }
  end

  def show
    course = Course.find(params[:id])
    render json: format_course(course)
  end

  def create
    course = Course.new(course_params)
    authorize course
    if course.save
      render json: format_course(course), status: :created
    else
      render json: { error: course.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    course = Course.find(params[:id])
    authorize course
    if course.update(course_params)
      render json: format_course(course)
    else
      render json: { error: course.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def destroy
    course = Course.find(params[:id])
    authorize course
    course.destroy
    head :no_content
  end

  private

  def course_params
    params.require(:course).permit(:title, :level, :duration_days, :price_cents, :description)
  end

  def format_course(course)
    {
      id: course.id,
      title: course.title,
      level: course.level,
      durationDays: course.duration_days,
      priceCents: course.price_cents,
      description: course.description
    }
  end
end
