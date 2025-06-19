import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

        const response = await axios.get(`http://localhost:5001/api/verify?token=${token}`);
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
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '400px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        backgroundColor: status === 'success' ? '#e6ffe6' : 
                       status === 'error' ? '#ffe6e6' : '#fff',
        textAlign: 'center'
      }}>
        <h2>Email Verification</h2>
        {status === 'loading' && (
          <div>⏳ {message}</div>
        )}
        {status === 'success' && (
          <div>
            ✅ {message}
            <p>Redirecting to login page...</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            ❌ {message}
            <p>Please try registering again if the problem persists.</p>
          </div>
        )}
      </div>
    </div>
  );
} 