import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Weather from '../components/Weather';
import api from '../api';

const Card = ({ to, title, description, icon }: { to: string, title: string, description: string, icon: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardStyle = {
    backgroundColor: '#1F2937',
    padding: '1.5rem',
    borderRadius: '12px',
    textDecoration: 'none',
    color: 'white',
    display: 'block',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
    boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  return (
    <Link 
      to={to} 
      style={cardStyle} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</h3>
      </div>
      <p style={{ margin: 0, color: '#9CA3AF' }}>{description}</p>
    </Link>
  );
};

// Simple SVG Icons
const UpdatesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ActionsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-8m0-4V4m8 8h-8m-4 0H4"/></svg>;

const DashboardHome = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setUsername(response.data.username);
      } catch (error) {
        console.error('Failed to fetch username', error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome back, {username}!</h1>
      <p style={{ fontSize: '1.125rem', color: '#9CA3AF', marginBottom: '2rem' }}>Here's the weather forecast for today.</p>
      
      <div style={{
        backgroundColor: '#1F2937',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem'
      }}>
        <Weather />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
      }}>
        <Card 
          to="/dashboard/updates" 
          title="Recent Updates" 
          description="View and manage your weather updates"
          icon={<UpdatesIcon />}
        />
        <Card 
          to="/dashboard/profile" 
          title="Profile" 
          description="Manage your account settings"
          icon={<ProfileIcon />}
        />
        <Card 
          to="#" 
          title="Quick Actions" 
          description="Add new weather update or view statistics"
          icon={<ActionsIcon />}
        />
      </div>
    </div>
  );
};

export default DashboardHome; 