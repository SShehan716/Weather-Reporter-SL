import React, { useState } from 'react';
import api from '../api';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailInfo, setEmailInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendError, setResendError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setEmailInfo(null);
    setLoading(true);
    try {
      const response = await api.post('/forgot-password', { email });
      setMessage('If that email is registered, a reset link has been sent.');
      
      // Add email delivery guidance
      setEmailInfo({
        note: 'Email delivery can take a few minutes. Please check your spam/junk folder if you don\'t see it in your inbox.',
        sentAt: new Date().toISOString()
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendReset = async () => {
    setResendLoading(true);
    setResendError('');
    
    try {
      await api.post('/resend-reset', { email });
      setResendCooldown(60);
      setResendError('');
      
      // Start countdown
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
      setResendError(err.response?.data?.error || 'Failed to resend reset link');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #e0f7fa 0%, #fff 100%)',
      padding: 0
    }}>
      {loading && <Spinner />}
      <div style={{
        maxWidth: 420,
        width: '100%',
        margin: '0 auto',
        padding: 32,
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 4px 24px rgba(44,62,80,0.10)',
        border: '1.5px solid #e0e0e0',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#1976d2', marginBottom: 18 }}>Forgot Password</h2>
        {message && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#43a047', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
              {message}
            </div>
            {emailInfo && (
              <div style={{
                background: '#e8f5e9',
                padding: '18px 18px 12px 18px',
                borderRadius: '10px',
                fontSize: '15px',
                color: '#256029',
                borderLeft: '6px solid #43a047',
                fontWeight: 500,
                marginTop: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontWeight: 700, color: '#1976d2', marginBottom: 6, fontSize: 16, textAlign: 'left' }}>Tips</div>
                <ul style={{ margin: '7px 0 0 22px', padding: 0, color: '#256029', fontSize: 15, textAlign: 'left', listStylePosition: 'inside' }}>
                  <li>Check your spam/junk folder</li>
                  <li>Email delivery can take 2-5 minutes</li>
                  <li>The reset link is valid for 1 hour</li>
                </ul>
                
                {/* Resend reset link button */}
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={handleResendReset}
                    disabled={resendLoading || resendCooldown > 0}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      background: resendCooldown > 0 ? '#ccc' : '#1976d2',
                      color: 'white',
                      fontWeight: 600,
                      cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: '0 auto'
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
                      'Resend reset link'
                    )}
                  </button>
                  {resendError && (
                    <p style={{ color: '#e53935', fontSize: '13px', marginTop: '8px', fontWeight: 500 }}>
                      {resendError}
                    </p>
                  )}
                </div>
              </div>
            )}
            {/* Go to Login link */}
            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <Link to="/login" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500, fontSize: 15 }}>
                Go to Login
              </Link>
            </div>
          </div>
        )}
        {error && <div style={{ color: '#e53935', marginBottom: 12, fontWeight: 600 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 12, marginBottom: 18, borderRadius: 7, border: '1.5px solid #bdbdbd', fontSize: 16 }}
          />
          <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 7, background: '#1976D2', color: 'white', border: 'none', fontWeight: 'bold', fontSize: 16, marginTop: 4 }}>Send Reset Link</button>
        </form>
      </div>
    </div>
  );
} 