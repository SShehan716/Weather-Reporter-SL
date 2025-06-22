import React, { useState, useEffect } from 'react';
import api from '../api';
import WeatherIcon from './WeatherIcons';

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

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [locationToFetch, setLocationToFetch] = useState('Colombo');
  const [searchQuery, setSearchQuery] = useState('Colombo');

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocationToFetch(searchQuery);
  };

  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: '#4ade80' };
    if (uv <= 5) return { level: 'Moderate', color: '#fbbf24' };
    if (uv <= 7) return { level: 'High', color: '#f97316' };
    if (uv <= 10) return { level: 'Very High', color: '#ef4444' };
    return { level: 'Extreme', color: '#7c3aed' };
  };

  if (loading && !weather) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', fontSize: '18px', color: '#666' }}>
        Loading weather data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#dc3545' }}>
        <div style={{ marginBottom: '10px' }}>Error: {error}</div>
        <button onClick={() => fetchWeather(locationToFetch)} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  if (!weather) {
    return <div>No weather data available.</div>;
  }
  
  const uvInfo = getUvLevel(weather.current.uvIndex);

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#E5E7EB', fontWeight: 'bold', fontSize: '1.5rem' }}>Weather Lookup</h2>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '20px', maxWidth: '500px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter a city or zip code"
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1F2937', color: 'white', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#1D4ED8', color: 'white', fontSize: '16px', cursor: 'pointer' }}>Search</button>
      </form>
      
      <>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', color: '#E5E7EB', fontSize: '1.75rem' }}>
              {weather.location.name}, {weather.location.country}
            </h2>
            <p style={{ margin: '0', color: '#9CA3AF', fontSize: '14px' }}>
              {new Date(weather.location.localtime).toLocaleString()}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={weather.current.condition.icon} alt={weather.current.condition.text} style={{ width: '50px', height: '50px' }}/>
            <span style={{ color: '#9CA3AF', fontSize: '14px' }}>{weather.current.condition.text}</span>
          </div>
        </div>

        {/* Temperature */}
        <div style={{ textAlign: 'center', marginBottom: '24px', padding: '2rem', backgroundColor: '#1F2937', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '4rem', fontWeight: 'bold', color: 'white' }}>
                {unit === 'celsius' ? `${Math.round(weather.current.temperature.celsius)}` : `${Math.round(weather.current.temperature.fahrenheit)}`}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignSelf: 'flex-start', paddingTop: '0.5rem' }}>
                 <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', lineHeight: '1' }}>
                  °{unit === 'celsius' ? 'C' : 'F'}
                </span>
                <button
                  onClick={() => setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')}
                  style={{ backgroundColor: 'transparent', color: '#9CA3AF', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0', lineHeight: '1' }}
                >
                  °{unit === 'celsius' ? 'F' : 'C'}
                </button>
              </div>
            </div>
            <span style={{ fontSize: '1.125rem', color: '#9CA3AF' }}>
              Feels like {unit === 'celsius' ? `${Math.round(weather.current.feelsLike.celsius)}°C` : `${Math.round(weather.current.feelsLike.fahrenheit)}°F`}
            </span>
        </div>

        {/* Other Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', textAlign: 'center' }}>
          <div style={{ background: '#1e3a8a', color: 'white', padding: '20px', borderRadius: '12px' }}>
            <WeatherIcon type="humidity" size={40} />
            <h4 style={{ margin: '10px 0 5px 0' }}>Humidity</h4>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{weather.current.humidity}%</p>
          </div>
          <div style={{ background: '#064e3b', color: 'white', padding: '20px', borderRadius: '12px' }}>
            <WeatherIcon type="wind" size={40} />
            <h4 style={{ margin: '10px 0 5px 0' }}>Wind Speed</h4>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{weather.current.windSpeed.kph} km/h</p>
          </div>
          <div style={{ background: '#b45309', color: 'white', padding: '20px', borderRadius: '12px' }}>
            <WeatherIcon type="uv" size={40} />
            <h4 style={{ margin: '10px 0 5px 0' }}>UV Index</h4>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{weather.current.uvIndex} <span style={{fontSize: '16px', opacity: 0.9}}>({uvInfo.level})</span></p>
          </div>
        </div>
      
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button onClick={() => fetchWeather(locationToFetch)} disabled={loading} style={{ backgroundColor: '#4F46E5', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.6 : 1, transition: 'background-color 0.2s' }}>
            <WeatherIcon type="refresh" size={20} color="white" />
            {loading ? 'Refreshing...' : 'Refresh Weather'}
          </button>
        </div>
      </>
    </div>
  );
}