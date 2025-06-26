import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';
import CountryAutocomplete from './components/CountryAutocomplete';
import api from './api'; // Import the centralized api instance
import Spinner from './components/Spinner';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailInfo, setEmailInfo] = useState<any>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendError, setResendError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!country) {
      setError('Please select your country');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    setEmailInfo(null);
    
    try {
      const response = await api.post('/register', {
        username,
        email,
        password,
        country,
      });
      
      setSuccess('Registration successful! Please check your email to verify your account.');
      if (response.data.emailInfo) {
        setEmailInfo(response.data.emailInfo);
      }
      
      // Don't auto-redirect, let user see the email info
      setTimeout(() => {
        if (emailInfo) {
          navigate('/login');
        }
      }, 8000); // Give user 8 seconds to read the info
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to register';
      // If the error is about not verified, redirect to verify page
      if (errorMsg.includes('already registered but not verified')) {
        navigate('/verify', { state: { email } });
        return;
      }
      setError(errorMsg);
      if (err.response?.data?.note) {
        setEmailInfo({ note: err.response.data.note });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendError('');
    
    try {
      await api.post('/resend-verification', { email });
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
      setResendError(err.response?.data?.error || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };
  
  const backgroundImageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

  return (
    <div className={styles.container} style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImageUrl})`,
      position: 'relative',
    }}>
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Spinner />
        </div>
      )}
      <nav className={styles.nav}>
        <div className={styles.appName}>
          Weather Reporter
        </div>
        <Link to="/" className={styles.navLink}>
          Back to Home
        </Link>
      </nav>

      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>Create an Account</h2>
          {error && <p className={styles.error}>{error}</p>}
          {success && (
            <div className={styles.successContainer}>
              <p className={styles.success}>{success}</p>
              {emailInfo && (
                <div className={styles.emailInfo}>
                  <p style={{ fontSize: '15px', color: '#1976d2', marginTop: '10px', fontWeight: 600 }}>
                    <strong>Email sent at:</strong> {new Date(emailInfo.sentAt).toLocaleString()}
                  </p>
                  <p style={{ fontSize: '14px', color: '#333', marginTop: '5px' }}>
                    {emailInfo.note}
                  </p>
                  <div style={{
                    background: '#e8f5e9',
                    padding: '12px',
                    borderRadius: '7px',
                    marginTop: '12px',
                    fontSize: '14px',
                    color: '#256029',
                    borderLeft: '5px solid #43a047',
                    fontWeight: 500
                  }}>
                    <strong>Tips:</strong>
                    <ul style={{ margin: '7px 0 0 22px', padding: 0 }}>
                      <li>Check your spam/junk folder</li>
                      <li>Email delivery can take 2-5 minutes</li>
                      <li>You can try logging in once you receive the email</li>
                    </ul>
                  </div>
                  
                  {/* Resend verification button */}
                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={handleResendVerification}
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
                        'Resend verification email'
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
            </div>
          )}
          {!success && (
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="country">Country</label>
                <CountryAutocomplete
                  value={country}
                  onChange={setCountry}
                  placeholder="Search for your country..."
                  required
                />
              </div>
              <div className={styles.inputGroup} style={{ position: 'relative' }}>
                <label htmlFor="password">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 10 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 38,
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
              <div className={styles.inputGroup} style={{ position: 'relative' }}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ paddingRight: 10 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 38,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#888',
                    padding: 0
                  }}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.21-2.73 3.29-5 6-6.32" /><path d="M1 1l22 22" /><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.38 0 2.63-.56 3.54-1.47" /></svg>
                  ) : (
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
              <button type="submit" className={styles.submitButton}>
                Register
              </button>
            </form>
          )}
          <p className={styles.loginLink}>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 