import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api'; // Import the centralized api instance

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { identifier, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  const backgroundImageUrl = 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <nav style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          Weather Reporter
        </div>
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          padding: '8px 16px',
          border: '2px solid white',
          borderRadius: '6px',
          transition: 'all 0.3s ease'
        }}>
          Back to Home
        </Link>
      </nav>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Login</h2>
          {error && <p style={{ color: '#ff8a80', textAlign: 'center' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="identifier" style={{ display: 'block', marginBottom: '8px' }}>Username or Email</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>
            <button type="submit" style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#1976D2',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}>
              Login
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '16px' }}>
            Don't have an account? <Link to="/register" style={{ color: '#82b1ff' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 