import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherUpdate {
  id: number;
  location: string;
  temperature: number;
  conditions: string;
  timestamp: string;
}

export default function Updates() {
  const [updates, setUpdates] = useState<WeatherUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/weather-updates');
      setUpdates(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch updates');
      setLoading(false);
    }
  };

  const deleteUpdate = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5001/api/weather-updates/${id}`);
      setUpdates(updates.filter(update => update.id !== id));
    } catch (err) {
      setError('Failed to delete update');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: '#dc3545' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Weather Updates</h1>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => {/* Add new update logic */}}
        >
          Add New Update
        </button>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {updates.length === 0 ? (
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            No updates yet. Add your first weather update!
          </div>
        ) : (
          updates.map(update => (
            <div
              key={update.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h3>{update.location}</h3>
                <p>Temperature: {update.temperature}°C</p>
                <p>Conditions: {update.conditions}</p>
                <p style={{ color: '#666' }}>
                  {new Date(update.timestamp).toLocaleString()}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {/* Edit update logic */}}
                >
                  Edit
                </button>
                <button
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => deleteUpdate(update.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 