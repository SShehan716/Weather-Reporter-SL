import React, { useState } from 'react';
import api from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/forgot-password', { email });
      setMessage('If that email is registered, a reset link has been sent.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
      <h2>Forgot Password</h2>
      {message && <div style={{ color: 'green', marginBottom: 12 }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 6, background: '#1976D2', color: 'white', border: 'none', fontWeight: 'bold' }}>Send Reset Link</button>
      </form>
    </div>
  );
} 