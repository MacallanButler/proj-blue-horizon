Rails.application.routes.draw do
  # Mount devise under API namespace with custom controllers
  devise_for :users, path: 'api/v1/users', controllers: {
    sessions: 'api/v1/users/sessions',
    registrations: 'api/v1/users/registrations'
  }, path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  }

  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      # Custom user/profile endpoints
      post 'users/guest_upgrade', to: 'users#guest_upgrade'
      patch 'users/me/cert', to: 'users#update_cert'
      get 'users/:id/cert_photo', to: 'users#cert_photo', as: :user_cert_photo
      patch 'users/:id/verify_cert', to: 'users#verify_cert'
      patch 'users/:id/role', to: 'users#update_role'
      get 'users/me', to: 'users#me'

      resources :dive_sites
      resources :trips
      
      resources :bookings, only: [:index, :show, :create, :update, :destroy] do
        member do
          post :payment_intent
        end
        collection do
          get :mine
        end
      end

      resources :courses
      resources :course_enrollments, only: [:index, :show, :create, :update]
      resources :conservation_events
      
      resources :rsvps, only: [:index, :create, :update] do
        collection do
          get :mine
        end
        member do
          patch :attendance
        end
      end

      resources :log_entries, only: [:index, :create, :update, :destroy]
      
      get 'impact_stats', to: 'impact_stats#show'
      post 'webhooks/stripe', to: 'webhooks#stripe'
    end
  end
end
