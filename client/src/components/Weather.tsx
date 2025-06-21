import React, { useState, useEffect } from 'react';
import api from '../api';
import { useLoadScript } from '@react-google-maps/api';
import GoogleMapsAutocomplete from './GoogleMapsAutocomplete';
import Map from './Map';
import WeatherIcon from './WeatherIcons';
import '../pages/PublicWeather.css';

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

const libraries: ('places')[] = ['places'];

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [locationToFetch, setLocationToFetch] = useState('Colombo');
  const [searchQuery, setSearchQuery] = useState('Colombo');
  const [mapCenter, setMapCenter] = useState({ lat: 6.9271, lng: 79.8612 }); // Default to Colombo

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  useEffect(() => {
    fetchWeather(locationToFetch);
  }, [locationToFetch]);

  const fetchWeather = async (location: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get<WeatherData>(`/weather?location=${encodeURIComponent(location)}`);
      setWeather(response.data);
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
      setMapCenter({ lat, lng });
      setLocationToFetch(`${lat},${lng}`);
      if (place.formatted_address) {
        setSearchQuery(place.formatted_address);
      }
    } else if (place.formatted_address) {
      setLocationToFetch(place.formatted_address);
      setSearchQuery(place.formatted_address);
    }
  };

  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: '#4ade80' };
    if (uv <= 5) return { level: 'Moderate', color: '#fbbf24' };
    if (uv <= 7) return { level: 'High', color: '#f97316' };
    if (uv <= 10) return { level: 'Very High', color: '#ef4444' };
    return { level: 'Extreme', color: '#7c3aed' };
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading weather data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        color: '#dc3545'
      }}>
        <div style={{ marginBottom: '10px' }}>Error: {error}</div>
        <button
          onClick={() => fetchWeather(locationToFetch)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!weather) {
    return <div>No weather data available</div>;
  }

  const uvInfo = getUvLevel(weather.current.uvIndex);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Weather Lookup</h2>
      
      {/* Search Section */}
      <div style={{
        marginBottom: '20px',
        maxWidth: '500px',
      }}>
        {loadError && <div>Error loading maps. Please check your API key.</div>}
        {!isLoaded && <div>Loading Maps...</div>}
        {isLoaded && (
          <>
            <GoogleMapsAutocomplete
              onPlaceSelected={handlePlaceSelected}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={setLocationToFetch}
            />
            <div style={{ marginTop: '20px' }}>
              <Map center={mapCenter} />
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', color: '#333' }}>
            {weather.location.name}
            {weather.location.region && `, ${weather.location.region}`}
            {weather.location.country && `, ${weather.location.country}`}
          </h2>
          <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
            {new Date(weather.location.localtime).toLocaleString()}
          </p>
          <p style={{ 
            margin: '4px 0 0 0', 
            color: '#999', 
            fontSize: '12px'
          }}>
            Coordinates: {weather.location.lat.toFixed(2)}°N, {weather.location.lon.toFixed(2)}°E
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <img 
            src={weather.current.condition.icon} 
            alt={weather.current.condition.text}
            style={{ width: '50px', height: '50px' }}
          />
          <span style={{ color: '#666', fontSize: '14px' }}>
            {weather.current.condition.text}
          </span>
        </div>
      </div>

      {/* Temperature */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '8px'
        }}>
          <span style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {unit === 'celsius' 
              ? `${Math.round(weather.current.temperature.celsius)}°C`
              : `${Math.round(weather.current.temperature.fahrenheit)}°F`
            }
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setUnit('celsius')}
              style={{
                padding: '4px 8px',
                backgroundColor: unit === 'celsius' ? '#007bff' : '#e9ecef',
                color: unit === 'celsius' ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('fahrenheit')}
              style={{
                padding: '4px 8px',
                backgroundColor: unit === 'fahrenheit' ? '#007bff' : '#e9ecef',
                color: unit === 'fahrenheit' ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              °F
            </button>
          </div>
        </div>
        <p style={{ margin: '0', color: '#666' }}>
          Feels like {unit === 'celsius' 
            ? `${Math.round(weather.current.feelsLike.celsius)}°C`
            : `${Math.round(weather.current.feelsLike.fahrenheit)}°F`
          }
        </p>
      </div>

      {/* Weather Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px'
      }}>
        {/* Humidity */}
        <div style={{
          padding: '16px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
            <WeatherIcon type="humidity" size={24} color="#1976D2" />
          </div>
          <div style={{ fontWeight: 'bold', color: '#333' }}>Humidity</div>
          <div style={{ fontSize: '18px', color: '#666' }}>{weather.current.humidity}%</div>
        </div>

        {/* Wind Speed */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f3e5f5',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
            <WeatherIcon type="wind" size={24} color="#4CAF50" />
          </div>
          <div style={{ fontWeight: 'bold', color: '#333' }}>Wind Speed</div>
          <div style={{ fontSize: '18px', color: '#666' }}>
            {unit === 'celsius' 
              ? `${weather.current.windSpeed.kph} km/h`
              : `${weather.current.windSpeed.mph} mph`
            }
          </div>
        </div>

        {/* UV Index */}
        <div style={{
          padding: '16px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
            <WeatherIcon type="uv" size={24} color="#FF8F00" />
          </div>
          <div style={{ fontWeight: 'bold', color: '#333' }}>UV Index</div>
          <div style={{ 
            fontSize: '18px', 
            color: uvInfo.color,
            fontWeight: 'bold'
          }}>
            {weather.current.uvIndex} ({uvInfo.level})
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => fetchWeather(locationToFetch)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            margin: '0 auto'
          }}
        >
          <WeatherIcon type="refresh" size={16} />
          <span>Refresh Weather</span>
        </button>
      </div>
    </div>
  );
} 