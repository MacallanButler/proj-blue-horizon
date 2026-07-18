class Api::V1::DiveSitesController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]

  def index
    sites = DiveSite.all
    month = params[:month]&.to_i || Time.current.month - 1 # default to current month (0-indexed)

    response_data = sites.map do |site|
      prediction = MarineLifePredictionService.new(site).predict(month)
      format_site(site, prediction)
    end

    render json: response_data
  end

  def show
    site = DiveSite.find(params[:id])
    month = params[:month]&.to_i || Time.current.month - 1
    prediction = MarineLifePredictionService.new(site).predict(month)

    render json: format_site(site, prediction)
  end

  def create
    site = DiveSite.new(dive_site_params)
    authorize site
    if site.save
      render json: site, status: :created
    else
      render json: { error: site.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    site = DiveSite.find(params[:id])
    authorize site
    if site.update(dive_site_params)
      render json: site
    else
      render json: { error: site.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def destroy
    site = DiveSite.find(params[:id])
    authorize site
    site.destroy
    head :no_content
  end

  private

  def dive_site_params
    params.require(:dive_site).permit(
      :name, :location, :country, :depth_min, :depth_max,
      :visibility_min, :visibility_max, :temperature_min, :temperature_max,
      :difficulty, :rating, :reviews, :description, :image_url,
      :lat, :lng, :current_strength,
      marine_life: [], best_months: [], features: []
    )
  end

  def format_site(site, prediction)
    {
      id: site.id,
      name: site.name,
      location: site.location,
      country: site.country,
      depth: { min: site.depth_min, max: site.depth_max },
      visibility: { min: site.visibility_min, max: site.visibility_max },
      temperature: { min: site.temperature_min, max: site.temperature_max },
      difficulty: site.difficulty,
      rating: site.rating,
      reviews: site.reviews,
      description: site.description,
      imageUrl: site.image_url,
      coordinates: { lat: site.lat, lng: site.lng },
      marineLife: site.marine_life || [],
      bestMonths: site.best_months || [],
      currentStrength: site.current_strength,
      features: site.features || [],
      predictedMarineLife: prediction
    }
  end
end
