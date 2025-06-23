import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styles from './AddUpdate.module.css';
import GoogleMapsAutocomplete from '../components/GoogleMapsAutocomplete';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';

interface LocationData {
  name: string;
  lat: number | null;
  lon: number | null;
}

const AddUpdate = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('general');

  // General Update State
  const [generalLocation, setGeneralLocation] = useState<LocationData>({ name: '', lat: null, lon: null });
  const [temperature, setTemperature] = useState('');
  const [conditions, setConditions] = useState('');
  
  // Risk Update State
  const [riskLocation, setRiskLocation] = useState<LocationData>({ name: '', lat: null, lon: null });
  const [disasterType, setDisasterType] = useState('');
  const [image, setImage] = useState<File | null>(null);

  // Common State
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGeneralPlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      setGeneralLocation({
        name: place.formatted_address || place.name || 'Unknown Location',
        lat: place.geometry.location.lat(),
        lon: place.geometry.location.lng(),
      });
    }
  };

  const handleRiskPlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      setRiskLocation({
        name: place.formatted_address || place.name || 'Unknown Location',
        lat: place.geometry.location.lat(),
        lon: place.geometry.location.lng(),
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!generalLocation.name || generalLocation.lat === null || !temperature || !conditions) {
      setError('All fields, including a valid location, are required.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/weather-updates', {
        locationName: generalLocation.name,
        lat: generalLocation.lat,
        lon: generalLocation.lon,
        temperature: parseFloat(temperature),
        conditions,
      });
      setSuccess('General weather update added successfully!');
      setTimeout(() => navigate('/dashboard/updates'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add general update.');
    } finally {
      setLoading(false);
    }
  };

  const handleRiskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!riskLocation.name || riskLocation.lat === null || !disasterType || !image) {
      setError('All fields, including a valid location and image, are required.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('locationName', riskLocation.name);
    formData.append('lat', String(riskLocation.lat));
    formData.append('lon', String(riskLocation.lon));
    formData.append('disasterType', disasterType);
    formData.append('image', image);

    try {
      await api.post('/risk-updates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Risk update and image uploaded successfully!');
      setTimeout(() => navigate('/dashboard/updates'), 2000); // Or a new risk updates page
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload risk update.');
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralForm = () => (
    <form onSubmit={handleGeneralSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="location">Location</label>
        <GoogleMapsAutocomplete
          onPlaceSelected={handleGeneralPlaceSelected}
          value={generalLocation.name}
          onChange={(e) => setGeneralLocation({ ...generalLocation, name: e.target.value })}
          onSearch={() => {}}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="temperature">Temperature (°C)</label>
        <input id="temperature" type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="e.g., 15"/>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="conditions">Conditions</label>
        <input id="conditions" type="text" value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="e.g., Sunny with a light breeze"/>
      </div>
      <button type="submit" className={styles.submitButton}>Add General Update</button>
    </form>
  );

  const renderRiskForm = () => (
    <form onSubmit={handleRiskSubmit} className={styles.form}>
       <div className={styles.formGroup}>
        <label htmlFor="risk-location">Location</label>
        <GoogleMapsAutocomplete
          onPlaceSelected={handleRiskPlaceSelected}
          value={riskLocation.name}
          onChange={(e) => setRiskLocation({ ...riskLocation, name: e.target.value })}
          onSearch={() => {}}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="disasterType">Type of Disaster</label>
        <select id="disasterType" value={disasterType} onChange={(e) => setDisasterType(e.target.value)}>
            <option value="">Select a disaster type...</option>
            <option value="Flood">Flood</option>
            <option value="Wildfire">Wildfire</option>
            <option value="Landslide">Landslide</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Drought">Drought</option>
            <option value="Other">Other</option>
        </select>
      </div>
      <div className={styles.formGroup}>
          <label htmlFor="image">Upload Image</label>
          <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <button type="submit" className={styles.submitButton}>Add Risk Update</button>
    </form>
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <PageHeader
        title="Add New Update"
        description="Share the latest weather conditions or report a weather-related risk."
      />

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'general' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'risk' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('risk')}
        >
          Risk
        </button>
      </div>

      {success && <div className={styles.successMessage}>{success}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.form}>
        {activeTab === 'general' ? renderGeneralForm() : renderRiskForm()}
      </div>
    </div>
  );
};

export default AddUpdate; 