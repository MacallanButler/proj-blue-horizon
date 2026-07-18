class Api::V1::Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    # Generate the JWT token (devise-jwt does this automatically in headers, but let's make sure it is in payload too or return successful login)
    render json: {
      status: { code: 200, message: 'Logged in successfully.' },
      data: UserSerializer.new(resource).as_json
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: { code: 200, message: 'Logged out successfully.' }
      }, status: :ok
    else
      render json: {
        status: { code: 401, message: 'Active session not found.' }
      }, status: :unauthorized
    end
  end
end
