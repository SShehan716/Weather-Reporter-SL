import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import LogoutDialog from './LogoutDialog';
import api from '../api';

// SVGs for icons
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const UpdatesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>;
const AddUpdateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const HamburgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CrossIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="28" height="28">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar = ({ isCollapsed, toggleCollapse }: SidebarProps) => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    setShowLogout(true);
  };

  const confirmLogout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      // Optionally handle error
    }
    setShowLogout(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogout(false);
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => 
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

  return (
    <>
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
        <div>
          <div className={styles.header}>
            <h1 className={styles.logo}>Weather Reporter</h1>
            <button onClick={toggleCollapse} className={styles.toggleButton}>
              {isCollapsed ? <HamburgerIcon /> : <CrossIcon />}
            </button>
          </div>
          <nav className={styles.nav}>
            <NavLink to="/dashboard/home" className={navLinkStyle}>
              <DashboardIcon />
              <span className={styles.navLinkText}>Dashboard</span>
            </NavLink>

            <NavLink to="/dashboard/updates" className={navLinkStyle}>
              <UpdatesIcon />
              <span className={styles.navLinkText}>My Updates</span>
            </NavLink>
            <NavLink to="/dashboard/add-update" className={navLinkStyle}>
              <AddUpdateIcon />
              <span className={styles.navLinkText}>Add Updates</span>
            </NavLink>
            <NavLink to="/dashboard/profile" className={navLinkStyle}>
              <ProfileIcon />
              <span className={styles.navLinkText}>Profile</span>
            </NavLink>
          </nav>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogoutIcon />
          <span className={styles.logoutText}>Logout</span>
        </button>
      </aside>
      <LogoutDialog open={showLogout} onConfirm={confirmLogout} onCancel={cancelLogout} />
    </>
  );
};

export default Sidebar;