import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const WeatherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch('/api/weather');
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError('Error loading weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Weather Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Weather Information</h2>
            {weatherData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Weather data will be displayed here */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Temperature</h3>
                  <p className="text-2xl">{weatherData.temperature}°C</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Humidity</h3>
                  <p className="text-2xl">{weatherData.humidity}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Wind Speed</h3>
                  <p className="text-2xl">{weatherData.windSpeed} km/h</p>
                </div>
              </div>
            ) : (
              <p>No weather data available</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default WeatherDashboard; 