import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
}

const containerStyle = {
  width: '100%',
  height: '250px',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

export default function Map({ center }: MapProps) {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={mapOptions}
    >
      <Marker position={center} />
    </GoogleMap>
  );
} 