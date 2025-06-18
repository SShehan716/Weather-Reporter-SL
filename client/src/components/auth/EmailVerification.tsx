import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Invalid verification link');
        setLoading(false);
        return;
      }

      try {
        await verifyEmail(token);
        // Redirect to login after successful verification
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setError('Failed to verify email. The link may have expired.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, verifyEmail, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verifying your email...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <p className="text-center">{error}</p>
            <div className="text-center mt-4">
              <button
                onClick={() => navigate('/login')}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Return to Login
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <p className="text-center">
              Email verified successfully! Redirecting to login...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification; 