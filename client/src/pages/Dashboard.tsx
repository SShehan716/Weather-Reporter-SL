import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardHome from './DashboardHome';
import Profile from './Profile';
import Updates from './Updates';
import AddUpdate from './AddUpdate';

const Dashboard = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const sidebarWidth = isSidebarCollapsed ? 88 : 260;

  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh', display: 'flex' }}>
      <Sidebar isCollapsed={isSidebarCollapsed} toggleCollapse={toggleSidebar} />
      <main style={{ flexGrow: 1, padding: '2rem', color: 'white', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <Routes>
                <Route path="/" element={<Navigate to="home" replace />} />
                <Route path="home" element={<DashboardHome />} />
                <Route path="profile" element={<Profile />} />
                <Route path="updates" element={<Updates />} />
                <Route path="add-update" element={<AddUpdate />} />
            </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;