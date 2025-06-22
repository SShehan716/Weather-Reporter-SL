import React, { useState, useEffect } from 'react';
import api from '../api'; // Use the centralized api instance

interface UserProfile {
  username: string;
  email: string;
  // Add other fields you expect from the backend
}

const Profile = () => {
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
    return <div style={{ color: '#ff8a80' }}>{error}</div>;
  }

  if (!profile) {
    return <div>Could not load profile.</div>;
  }

  // A simple hashing function for the avatar color
  const getAvatarColor = (name: string) => {
    const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#34d399', '#22d3ee', '#60a5fa', '#818cf8', '#c084fc'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash % colors.length)];
  };

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>My Profile</h1>
      <div style={{
        backgroundColor: '#1F2937',
        borderRadius: '12px',
        padding: '2.5rem',
        maxWidth: '600px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: getAvatarColor(profile.username),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            textTransform: 'uppercase'
          }}>
            {profile.username.charAt(0)}
          </div>
          <div style={{ flexGrow: 1 }}>
            <div>
              <label style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Username</label>
              <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '500' }}>{profile.username}</p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Email Address</label>
              <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '500' }}>{profile.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;