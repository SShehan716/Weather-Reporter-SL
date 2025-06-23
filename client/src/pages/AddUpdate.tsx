import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styles from './AddUpdate.module.css';
import GoogleMapsAutocomplete from '../components/GoogleMapsAutocomplete';

interface LocationData {
  name: string;
  lat: number | null;
  lon: number | null;
}

const AddUpdate = () => {
  const [location, setLocation] = useState<LocationData>({ name: '', lat: null, lon: null });
  const [temperature, setTemperature] = useState('');
  const [conditions, setConditions] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      setLocation({
        name: place.formatted_address || place.name || 'Unknown Location',
        lat: place.geometry.location.lat(),
        lon: place.geometry.location.lng(),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!location.name || location.lat === null || location.lon === null || !temperature || !conditions) {
      setError('All fields, including a valid location, are required.');
      return;
    }

    try {
      await api.post('/weather-updates', {
        locationName: location.name,
        lat: location.lat,
        lon: location.lon,
        temperature: parseFloat(temperature),
        conditions,
      });
      setSuccess('Weather update added successfully!');
      setTimeout(() => {
        navigate('/dashboard/updates');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add update.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add New Weather Update</h1>
      <p className={styles.subtitle}>
        Share the latest weather conditions for any location.
      </p>

      {success && <div className={styles.successMessage}>{success}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="location">Location</label>
          <GoogleMapsAutocomplete
            onPlaceSelected={handlePlaceSelected}
            value={location.name}
            onChange={(e) => setLocation({ ...location, name: e.target.value })}
            onSearch={() => {}} // Not needed for this form
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="temperature">Temperature (°C)</label>
          <input
            id="temperature"
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="e.g., 15"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="conditions">Conditions</label>
          <input
            id="conditions"
            type="text"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            placeholder="e.g., Sunny with a light breeze"
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Add Update
        </button>
      </form>
    </div>
  );
};

export default AddUpdate; 