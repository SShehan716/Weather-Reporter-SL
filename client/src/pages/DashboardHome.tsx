import React from 'react';

export default function DashboardHome() {
  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Welcome to Weather Reporter</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        padding: '20px 0'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Recent Updates</h3>
          <p>View and manage your weather updates</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Profile</h3>
          <p>Manage your account settings</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Quick Actions</h3>
          <p>Add new weather update or view statistics</p>
        </div>
      </div>
    </div>
  );
} 