import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './BottomNavBar.module.css';

const BottomNavBar = () => {
  return (
    <nav className={styles.bottomNav}>
      <NavLink to="/dashboard/home" className={({ isActive }) => isActive ? styles.active : ''}>
        <span className={styles.icon}>
          {/* Home Icon */}
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </span>
        <span className={styles.label}>Home</span>
      </NavLink>
      <NavLink to="/dashboard/updates" className={({ isActive }) => isActive ? styles.active : ''}>
        <span className={styles.icon}>
          {/* Updates Icon */}
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
        </span>
        <span className={styles.label}>Updates</span>
      </NavLink>
      <NavLink to="/dashboard/add-update" className={({ isActive }) => isActive ? styles.active : ''}>
        <span className={styles.icon}>
          {/* Add Icon */}
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
        </span>
        <span className={styles.label}>Add</span>
      </NavLink>
      <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? styles.active : ''}>
        <span className={styles.icon}>
          {/* Profile Icon */}
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4" /><path d="M5.5 21a7.5 7.5 0 0113 0" /></svg>
        </span>
        <span className={styles.label}>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNavBar; 