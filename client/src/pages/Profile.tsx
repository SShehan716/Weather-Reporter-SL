import React, { useState, useEffect } from 'react';
import api from '../api'; // Use the centralized api instance

interface UserProfile {
  username: string;
  email: string;
  // Add other fields you expect from the backend
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get<UserProfile>('/profile');
        setProfile(response.data);
      } catch (err) {
        setError('Failed to fetch profile. Please try logging in again.');
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!profile) {
    return <div>Could not load profile.</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>User Profile</h1>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Username</label>
            <p style={{ margin: 0 }}>{profile.username}</p>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <p style={{ margin: 0 }}>{profile.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 