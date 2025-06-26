import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Spinner from '../components/Spinner';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/reset-password', { token, password });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
      {loading && <Spinner />}
      <h2>Reset Password</h2>
      {message && <div style={{ color: 'green', marginBottom: 12 }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 10px 10px 10px', marginBottom: 12, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#888',
              padding: 0
            }}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.21-2.73 3.29-5 6-6.32" /><path d="M1 1l22 22" /><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.38 0 2.63-.56 3.54-1.47" /></svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7" /><circle cx="12" cy="12" r="3" /></svg>
            )}
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 10px 10px 10px', marginBottom: 16, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#888',
              padding: 0
            }}
            tabIndex={-1}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.21-2.73 3.29-5 6-6.32" /><path d="M1 1l22 22" /><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.38 0 2.63-.56 3.54-1.47" /></svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7" /><circle cx="12" cy="12" r="3" /></svg>
            )}
          </button>
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 6, background: '#1976D2', color: 'white', border: 'none', fontWeight: 'bold' }}>Reset Password</button>
      </form>
    </div>
  );
} 