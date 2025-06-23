import React, { useState, useEffect } from 'react';
import api from '../api'; // Use the centralized api instance
import CountryAutocomplete from '../components/CountryAutocomplete';
import PageHeader from '../components/PageHeader';
import styles from './AddUpdate.module.css';
import Spinner from '../components/Spinner';

interface UserProfile {
  username: string;
  email: string;
  country?: string;
  // Add other fields you expect from the backend
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // States for editable fields
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');

  // States for UI feedback
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get<UserProfile>('/profile');
        setProfile(response.data);
        setUsername(response.data.username);
        setCountry(response.data.country || '');
      } catch (err) {
        setError('Failed to fetch profile. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess(false);

    try {
      const response = await api.put('/profile', { username, country });
      setProfile(response.data.user);
      setUsername(response.data.user.username);
      setCountry(response.data.user.country || '');
      setUpdateSuccess(true);
      setIsEditing(false); 
    } catch (err: any) {
      setUpdateError(err.response?.data?.error || 'Failed to update profile.');
    }
  };

  if (loading) {
    return <Spinner />;
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
    <div className={styles.container}>
      <PageHeader 
        title="My Profile"
        description="View and manage your personal information and account settings."
      />
      
      {updateSuccess && <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '8px', backgroundColor: '#10B981', color: 'white' }}>Profile updated successfully!</div>}
      {updateError && <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '8px', backgroundColor: '#EF4444', color: 'white' }}>{updateError}</div>}

      <div style={{
        backgroundColor: '#1F2937',
        borderRadius: '12px',
        padding: '2.5rem',
        maxWidth: '600px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
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
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{profile.username}</p>
              <p style={{ margin: 0, color: '#9CA3AF' }}>{profile.email}</p>
          </div>
           <button onClick={() => setIsEditing(!isEditing)} style={{ background: 'none', border: '1px solid #374151', color: '#9CA3AF', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleUpdateProfile}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="username" style={{ display: 'block', fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1F2937', color: 'white', fontSize: '1rem' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="country" style={{ display: 'block', fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>Country</label>
              <CountryAutocomplete
                value={country}
                onChange={setCountry}
                placeholder="Search for your country..."
                required
              />
            </div>
             <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#4F46E5', color: 'white', fontSize: '1rem', fontWeight: '500', cursor: 'pointer' }}>
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;