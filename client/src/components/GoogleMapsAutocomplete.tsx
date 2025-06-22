import React, { useRef } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';

interface GoogleMapsAutocompleteProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (query: string) => void;
}

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9e9e9e',
      zIndex: 1,
    }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function GoogleMapsAutocomplete({ onPlaceSelected, value, onChange, onSearch }: GoogleMapsAutocompleteProps) {
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const handlePlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        onPlaceSelected(places[0]);
      }
    }
  };

  const onLoad = (ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref;
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <SearchIcon />
        <StandaloneSearchBox
          onLoad={onLoad}
          onPlacesChanged={handlePlacesChanged}
        >
          <input
            type="text"
            placeholder="Search for a city, country, or district..."
            value={value}
            onChange={onChange}
            style={{
              boxSizing: `border-box`,
              border: `1px solid #e0e0e0`,
              width: `100%`,
              height: `48px`,
              padding: `0 48px 0 16px`,
              borderRadius: `8px`,
              backgroundColor: `white`,
              color: '#333',
              fontSize: `16px`,
              outline: `none`,
              textOverflow: `ellipses`,
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          />
        </StandaloneSearchBox>
      </div>
    </form>
  );
} 