# Weather API Setup Guide

## Getting Your Weather API Key

1. **Sign up at WeatherAPI.com**
   - Go to [https://www.weatherapi.com/](https://www.weatherapi.com/)
   - Click "Sign Up" and create a free account
   - Verify your email address

2. **Get Your API Key**
   - After signing in, go to your dashboard
   - Copy your API key from the dashboard
   - The free tier includes 1,000,000 calls per month

## Environment Configuration

Add the following line to your `server/.env` file:

```env
WEATHER_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with the actual API key you received from WeatherAPI.com.

## API Features

The weather API provides:
- **Current Weather**: Temperature, humidity, wind speed, UV index
- **Location**: Colombo, Sri Lanka
- **Units**: Both Celsius and Fahrenheit
- **Weather Condition**: Text description and icon

## Testing

After adding the API key:
1. Restart your server: `npm run dev`
2. Test the endpoint: `GET http://localhost:5001/api/weather`
3. Check the dashboard to see the weather display

## Free Tier Limits

- **1,000,000 calls per month**
- **Current weather data**
- **3-day forecasts**
- **Weather alerts**

## Troubleshooting

If you get an "Invalid weather API key" error:
1. Check that the API key is correctly added to your `.env` file
2. Ensure there are no extra spaces or quotes around the key
3. Restart your server after adding the key
4. Verify your API key is active in your WeatherAPI.com dashboard 