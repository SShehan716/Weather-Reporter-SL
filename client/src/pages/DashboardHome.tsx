import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Weather from '../components/Weather';
import api from '../api';
import UpdateCard, { Update as NearbyUpdate } from '../components/UpdateCard';
import PageHeader from '../components/PageHeader';
import styles from './AddUpdate.module.css';
import Spinner from '../components/Spinner';

const NearbyUpdates = () => {
  const [updates, setUpdates] = useState<NearbyUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNearbyUpdates = async () => {
      try {
        // The backend now determines location based on user's country
        const response = await api.get('/nearby-updates', {
          params: {
            radius: 50 // 50km radius
          }
        });
        setUpdates(response.data.updates);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch nearby updates');
        setLoading(false);
      }
    };

    fetchNearbyUpdates();
  }, []);

  if (loading) return <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '1rem' }}>Loading nearby updates...</div>;
  if (error) return <div style={{ color: '#EF4444', textAlign: 'center', padding: '1rem' }}>{error}</div>;

  if (updates.length === 0) {
    return (
      <div style={{
        backgroundColor: '#1F2937',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#E5E7EB' }}>Nearby Updates</h3>
        <p style={{ color: '#9CA3AF' }}>No updates found in your area yet.</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#1F2937',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem'
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#E5E7EB', fontSize: '1.5rem' }}>Nearby Updates</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {updates.slice(0, 6).map((update) => (
          <UpdateCard key={`${update.type}-${update.id}`} update={update} />
        ))}
      </div>
      
      {updates.length > 6 && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link 
            to="/dashboard/updates" 
            style={{ 
              color: '#3B82F6', 
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            View all updates →
          </Link>
        </div>
      )}
    </div>
  );
};

const DashboardHome = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setUsername(response.data.username);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch username', error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <PageHeader 
        title={`Welcome back, ${username}!`}
        description="Here's a snapshot of the current weather and recent updates in your area."
      />
      
      <div style={{
        backgroundColor: '#1F2937',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem'
      }}>
        <Weather />
      </div>

      <NearbyUpdates />

    </div>
  );
};

export default DashboardHome; 