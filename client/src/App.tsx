import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import Register from './Register';
import Login from './Login';
import Verify from './Verify';
import Dashboard from './pages/Dashboard';
import PublicWeather from './pages/PublicWeather';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/Spinner'; 
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './App.css';

const libraries: ('places')[] = ['places'];

function App() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  if (!isLoaded) {
    return <Spinner />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicWeather />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
