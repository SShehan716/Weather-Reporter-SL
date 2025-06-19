import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Profile from './Profile';
import Updates from './Updates';
import DashboardHome from './DashboardHome';

export default function Dashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      
      <main style={{ 
        marginLeft: '250px', // Same as sidebar width
        padding: '20px',
        width: 'calc(100% - 250px)',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/updates" element={<Updates />} />
        </Routes>
      </main>
    </div>
  );
} 