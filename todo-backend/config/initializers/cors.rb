Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:4200' # Allow access from the Angular development server

    resource '*',
      headers: :any,
      methods: [:get, :post, :options], # Allow GET, POST and OPTIONS (for PreFlight)
      credentials: true
  end
end