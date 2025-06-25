import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [auth, setAuth] = useState<'pending' | 'ok' | 'fail'>('pending');

  useEffect(() => {
    api.get('/profile')
      .then(() => setAuth('ok'))
      .catch(() => setAuth('fail'));
  }, []);

  if (auth === 'pending') return null; // Optionally show a spinner
  if (auth === 'fail') return <Navigate to="/login" replace />;
  return <>{children}</>;
} 