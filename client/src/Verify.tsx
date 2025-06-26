import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from './api';

export default function Verify() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'manual'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendError, setResendError] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If redirected with email in state, show manual verify UI
    if (location.state && location.state.email) {
      setEmail(location.state.email);
      setStatus('manual');
      setMessage('Your account is not verified. Please check your email for a verification link or resend below.');
      return;
    }
    // Otherwise, try to verify via token
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('manual');
      setMessage('No verification token found. Please enter your email to resend verification.');
      return;
    }
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/verify?token=${token}`);
        setStatus('success');
        setMessage(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. Please try again.');
      }
    };
    verifyEmail();
  }, [navigate, location]);

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendError('');
    try {
      await api.post('/resend-verification', { email });
      setResendCooldown(60);
      setResendError('');
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setResendError(err.response?.data?.error || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

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
        {status === 'manual' && (
          <div>
            <div style={{ fontSize: 20, color: '#1976d2', fontWeight: 600, marginBottom: 10 }}>{message}</div>
            <div style={{ margin: '18px 0' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ padding: '10px', borderRadius: '6px', border: '1.5px solid #bdbdbd', width: '100%', fontSize: 16 }}
              />
            </div>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendLoading || resendCooldown > 0 || !email}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                background: resendCooldown > 0 ? '#ccc' : '#1976d2',
                color: 'white',
                fontWeight: 600,
                cursor: resendCooldown > 0 || !email ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto',
                marginTop: 8
              }}
            >
              {resendLoading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend verification email'
              )}
            </button>
            {resendError && (
              <p style={{ color: '#e53935', fontSize: '13px', marginTop: '8px', fontWeight: 500 }}>
                {resendError}
              </p>
            )}
            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <Link to="/login" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500, fontSize: 15 }}>
                Go to Login
              </Link>
            </div>
          </div>
        )}
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