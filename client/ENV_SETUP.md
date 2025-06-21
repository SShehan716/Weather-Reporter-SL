# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5001/api

# Frontend Configuration  
REACT_APP_FRONTEND_URL=http://localhost:3000

# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY="your_google_maps_api_key_here"
```

## Server Environment Variables

In your `server/.env` file, make sure you have:

```env
# Database
DATABASE_URL="your_database_url"

# JWT Secret
JWT_SECRET="your-super-secret-and-long-string-that-is-hard-to-guess"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"

# Weather API (Required for weather features)
WEATHER_API_KEY="your_weather_api_key_from_weatherapi.com"
```

## Important Notes

1. **REACT_APP_ Prefix**: All environment variables in Create React App must be prefixed with `REACT_APP_`
2. **No Quotes**: Don't wrap the values in quotes unless they contain spaces
3. **Restart Required**: After creating or modifying the `.env` file, restart your development server
4. **Git Ignore**: The `.env` file should already be in `.gitignore` to keep sensitive data out of version control

## Weather API Setup

To get your Weather API key:
1. Sign up at [WeatherAPI.com](https://www.weatherapi.com/)
2. Get your free API key from the dashboard
3. Add it to your `server/.env` file as `WEATHER_API_KEY`

## Usage

The environment variables are accessed through:
- `process.env.REACT_APP_API_BASE_URL`
- `process.env.REACT_APP_FRONTEND_URL`

Or through the centralized config file: `src/config.ts`

## Production

For production, you'll want to set different values:
```env
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
REACT_APP_FRONTEND_URL=https://your-frontend-domain.com
``` 