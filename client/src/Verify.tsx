import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function Verify() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        
        if (!token) {
          setStatus('error');
          setMessage('No verification token found.');
          return;
        }

        const response = await api.get(`/verify?token=${token}`);
        setStatus('success');
        setMessage(response.data.message);
        
        // Redirect to login after 3 seconds on success
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: '#fff'
    }}>
      <div style={{
        maxWidth: '420px',
        padding: '32px 28px',
        borderRadius: '14px',
        boxShadow: '0 4px 24px rgba(44,62,80,0.10)',
        backgroundColor: '#fff',
        textAlign: 'center',
        border: '1.5px solid #e0e0e0',
        marginTop: '-60px'
      }}>
        <h2 style={{ color: '#1976d2', marginBottom: 18 }}>Email Verification</h2>
        {status === 'loading' && (
          <div style={{ fontSize: 32, margin: '24px 0', color: '#1976d2' }}>
            Verifying your email...
            <div style={{ fontSize: 18, marginTop: 10 }}>{message}</div>
          </div>
        )}
        {status === 'success' && (
          <div>
            <div style={{ fontSize: 32, color: '#43a047', marginBottom: 10, fontWeight: 700 }}>
              Email verified successfully!
            </div>
            <div style={{ fontSize: 20, color: '#256029', fontWeight: 600 }}>{message}</div>
            <p style={{ color: '#555', marginTop: 12 }}>You can now log in to your account.</p>
            <p style={{ color: '#888', fontSize: 14, marginTop: 8 }}>Redirecting to login page...</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <div style={{ fontSize: 32, color: '#e53935', marginBottom: 10, fontWeight: 700 }}>
              Verification failed
            </div>
            <div style={{ fontSize: 20, color: '#b71c1c', fontWeight: 600 }}>{message}</div>
            <p style={{ color: '#888', marginTop: 12 }}>Please try registering again if the problem persists.</p>
          </div>
        )}
      </div>
    </div>
  );
} 