import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and user data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Navigate to the login page
    navigate('/login');
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>
        <h2 className={styles.titleText}>Weather Reporter</h2>
      </div>

      <nav className={styles.nav}>
        <Link 
          to="/dashboard" 
          className={styles.navLink}
        >
          Dashboard
        </Link>
        
        <Link 
          to="/dashboard/profile" 
          className={styles.navLink}
        >
          Profile
        </Link>
        
        <Link 
          to="/dashboard/updates" 
          className={styles.navLink}
        >
          My Updates
        </Link>

        <button
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </nav>
    </div>
  );
} 