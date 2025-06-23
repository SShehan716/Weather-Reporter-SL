import React, { useRef, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface CountryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
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

export default function CountryAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Search for a country...",
  required = false 
}: CountryAutocompleteProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value);

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      
      if (place.address_components) {
        const countryComponent = place.address_components.find(c => c.types.includes('country'));
        if (countryComponent) {
          const countryName = countryComponent.long_name;
          setInputValue(countryName);
          onChange(countryName);
        }
      }
    }
  };

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <SearchIcon />
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={handlePlaceChanged}
        options={{
            types: ['(regions)'],
            fields: ['address_components', 'name']
        }}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          required={required}
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
      </Autocomplete>
    </div>
  );
} 