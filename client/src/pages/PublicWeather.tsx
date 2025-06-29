import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import GoogleMapsAutocomplete from '../components/GoogleMapsAutocomplete';
import Map from '../components/Map';
import WeatherIcon from '../components/WeatherIcons';
import api from '../api';
import './PublicWeather.css';

interface WeatherData {
  location: {
    name: string;
    country: string;
    localtime: string;
    region: string | null;
    lat: number;
    lon: number;
  };
  current: {
    temperature: {
      celsius: number;
      fahrenheit: number;
    };
    humidity: number;
    windSpeed: {
      kph: number;
      mph: number;
    };
    uvIndex: number;
    condition: {
      text: string;
      icon: string;
    };
    feelsLike: {
      celsius: number;
      fahrenheit: number;
    };
  };
}

export default function PublicWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [locationToFetch, setLocationToFetch] = useState('Colombo');
  const [searchQuery, setSearchQuery] = useState('Colombo');
  const [mapCenter, setMapCenter] = useState({ lat: 6.9271, lng: 79.8612 }); // Default to Colombo
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchWeather(locationToFetch);
  }, [locationToFetch]);

  // Add effect to ensure map center updates are processed
  useEffect(() => {
    // This effect ensures the map center state is properly updated
    // and triggers a re-render of the Map component
  }, [mapCenter]);

  const fetchWeather = async (location: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/weather?location=${encodeURIComponent(location)}`);
      setWeather(response.data);
      
      // Update map center with the coordinates from the weather response
      if (response.data?.location) {
        const newCenter = { 
          lat: response.data.location.lat, 
          lng: response.data.location.lon 
        };
        setMapCenter(newCenter);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const newCenter = { lat, lng };
      
      // Update map center immediately
      setMapCenter(newCenter);
      
      // Update location to fetch and search query with a small delay to ensure state updates are processed
      setTimeout(() => {
        setLocationToFetch(`${lat},${lng}`);
        if (place.formatted_address) {
          setSearchQuery(place.formatted_address);
        }
      }, 0);
    } else if (place.formatted_address) {
      setLocationToFetch(place.formatted_address);
      setSearchQuery(place.formatted_address);
    }
  };

  // Custom search handler that updates both weather and map
  const handleSearch = (location: string) => {
    setLocationToFetch(location);
  };

  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: '#4ade80', bgColor: '#dcfce7' };
    if (uv <= 5) return { level: 'Moderate', color: '#fbbf24', bgColor: '#fef3c7' };
    if (uv <= 7) return { level: 'High', color: '#f97316', bgColor: '#fed7aa' };
    if (uv <= 10) return { level: 'Very High', color: '#ef4444', bgColor: '#fee2e2' };
    return { level: 'Extreme', color: '#7c3aed', bgColor: '#ede9fe' };
  };

  const getWeatherBackground = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return 'https://images.unsplash.com/photo-1743738049563-520b88442d04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
    } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
      return 'https://images.unsplash.com/photo-1633555288122-a47b3e12c24d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
    } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
    } else {
      return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
    }
  };

  const handleRetry = () => {
    setSearchQuery('');
    setError('');
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '24px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌤️</div>
          <div>Loading weather data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <div style={{ marginBottom: '16px' }}>Error: {error}</div>
          <button
            onClick={handleRetry}
            style={{
              padding: '12px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '12px'
            }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{
              padding: '12px 24px',
              backgroundColor: 'white',
              color: '#4f46e5',
              border: '2px solid #4f46e5',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              textDecoration: 'none',
              marginLeft: '12px',
              fontWeight: 600
            }}
          >
            Go to Home
          </a>
          <div style={{ marginTop: 32 }}>
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for a city, country, or district..."
              style={{
                boxSizing: `border-box`,
                border: `1px solid #e0e0e0`,
                width: `100%`,
                maxWidth: 400,
                height: `48px`,
                padding: `0 16px`,
                borderRadius: `8px`,
                backgroundColor: `white`,
                color: '#333',
                fontSize: `16px`,
                outline: `none`,
                textOverflow: `ellipses`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                margin: '0 auto',
                display: 'block'
              }}
              autoFocus
            />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return <div>No weather data available</div>;
  }

  const uvInfo = getUvLevel(weather.current.uvIndex);
  const backgroundImage = getWeatherBackground(weather.current.condition.text);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: 'white',
      position: 'relative'
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          Weather Reporter
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/login" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '8px 16px',
            border: '2px solid white',
            borderRadius: '6px',
            transition: 'all 0.3s ease'
          }}>
            Login
          </Link>
          <Link to="/register" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid white',
            borderRadius: '6px',
            transition: 'all 0.3s ease'
          }}>
            Register
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}>
        {/* Search Section */}
        <div className="public-weather-card" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '80px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '500px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <GoogleMapsAutocomplete
            onPlaceSelected={handlePlaceSelected}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
          />
          <div style={{ marginTop: '20px' }}>
            <div className="map-container">
              <Map 
                key={`${mapCenter.lat}-${mapCenter.lng}`}
                center={mapCenter} 
              />
            </div>
          </div>
        </div>

        {/* Location and Time */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            margin: '0 0 8px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            {weather.location.name}
            {weather.location.region && `, ${weather.location.region}`}
            {weather.location.country && `, ${weather.location.country}`}
          </h1>
          <p style={{ 
            fontSize: '18px', 
            margin: '0',
            opacity: 0.9,
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            {new Date(weather.location.localtime).toLocaleString()}
          </p>
          <p style={{ 
            fontSize: '14px', 
            margin: '8px 0 0 0',
            opacity: 0.7,
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            Coordinates: {weather.location.lat.toFixed(2)}°N, {weather.location.lon.toFixed(2)}°E
          </p>
        </div>

        {/* Main Weather Card */}
        <div className="public-weather-card" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '800px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {/* Temperature Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img 
                src={weather.current.condition.icon} 
                alt={weather.current.condition.text}
                style={{ width: '80px', height: '80px' }}
              />
              <div>
                <div style={{ fontSize: '64px', fontWeight: 'bold', lineHeight: 1 }}>
                  {unit === 'celsius' 
                    ? `${Math.round(weather.current.temperature.celsius)}°C`
                    : `${Math.round(weather.current.temperature.fahrenheit)}°F`
                  }
                </div>
                <div style={{ fontSize: '20px', opacity: 0.9 }}>
                  {weather.current.condition.text}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setUnit('celsius')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: unit === 'celsius' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                °C
              </button>
              <button
                onClick={() => setUnit('fahrenheit')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: unit === 'fahrenheit' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                °F
              </button>
            </div>
          </div>

          <div style={{ 
            fontSize: '18px', 
            textAlign: 'center', 
            marginBottom: '40px',
            opacity: 0.9
          }}>
            Feels like {unit === 'celsius' 
              ? `${Math.round(weather.current.feelsLike.celsius)}°C`
              : `${Math.round(weather.current.feelsLike.fahrenheit)}°F`
            }
          </div>

          {/* Weather Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {/* Humidity */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <WeatherIcon type="humidity" size={32} color="white" />
              </div>
              <div style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Humidity</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{weather.current.humidity}%</div>
            </div>

            {/* Wind Speed */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <WeatherIcon type="wind" size={32} color="white" />
              </div>
              <div style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Wind Speed</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {unit === 'celsius' 
                  ? `${weather.current.windSpeed.kph} km/h`
                  : `${weather.current.windSpeed.mph} mph`
                }
              </div>
            </div>

            {/* UV */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <WeatherIcon type="uv" size={32} color="white" />
              </div>
              <div style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>UV</div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: uvInfo.color
              }}>
                {weather.current.uvIndex} ({uvInfo.level})
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={() => fetchWeather(locationToFetch)}
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                margin: '0 auto'
              }}
            >
              <WeatherIcon type="refresh" size={18} />
              <span>Refresh Weather</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          opacity: 0.8
        }}>
          <p style={{ margin: '0', fontSize: '14px' }}>
            Powered by WeatherAPI.com • Data updates every 10 minutes
          </p>
        </div>
      </div>
    </div>
  );
} 