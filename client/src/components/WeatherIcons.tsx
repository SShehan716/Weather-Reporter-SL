import React from 'react';

interface WeatherIconProps {
  type: 'humidity' | 'wind' | 'uv' | 'refresh';
  size?: number;
  color?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ type, size = 32, color = '#333' }) => {
  const iconStyle = {
    width: size,
    height: size,
  };

  switch (type) {
    case 'humidity':
      return (
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{...iconStyle, filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.4))'}}>
          <path fill="#dbdbdb" d="M172.47,309.99c-31.35-1.98-66.11,5.86-95.11-8.73-46.69-23.48-57.8-87.24-22.14-125.59,2.5-2.69,13.78-11.26,14.32-12.45,1.03-2.27.88-14.28,1.65-18.66,8.72-49.93,64.1-78.56,110.5-58.86,10.75-32.68,44.84-54.3,78.97-52.66,30.84,1.49,60.99,23.14,70.57,52.66,52.14-20.36,104.87,11.76,111.66,66.93.39,3.19-.77,7.82.49,10.59.8,1.75,7.23,5.48,9.24,7.37,36.03,33.89,35.22,91.59-4.27,122.22-32.61,25.3-69.5,15.24-107.89,17.17l-3.06-3.16c-16.32-38.34-38.9-77.71-63.42-110.77-11.29-15.23-19.6-20.75-33.3-2.93-15.1,19.64-31.31,46.81-43.49,68.53-8.17,14.57-15.95,29.39-21.64,45.11l-3.08,3.21Z"/>
          <path fill="#5d88c6" d="M340.45,309.99c28.43,84.72-70.8,151.1-139.81,96.89-29.97-23.55-40.27-60.87-28.18-96.89,9.84-29.31,30.21-62.12,47.05-88.16,6.49-10.03,16.69-27.34,24.47-35.52,5.45-5.74,13.15-7.65,20.5-3.87,5.93,3.05,24.49,32.52,29.27,39.95,16.59,25.77,36.99,58.7,46.69,87.61Z"/>
          <path fill="#5d88c6" d="M414.62,421.35c-22.07-22.07-4.55-50.08,8.88-71.22,2.39-3.76,12.29-19.62,15.45-20.57,7.49-2.26,14.2,11.36,17.82,16.88,6.94,10.6,17.39,27.43,20.54,39.45,9.76,37.16-36.38,61.79-62.7,35.47Z"/>
          <path fill="#5d88c6" d="M98.3,421.35c-21.82,21.82-61.1,8.53-64.18-22.38-1.55-15.61,13.49-39.53,22.03-52.54,3.63-5.52,10.32-19.14,17.82-16.88,3.15.95,13.07,16.82,15.45,20.57,13.4,21.16,30.95,49.16,8.88,71.22Z"/>
          <path fill="#5d88c6" d="M151.9,405.25c1.52-.46,3.45-.52,4.88.28,1.03.58,7.43,10.57,8.69,12.53,7.24,11.16,17.59,27.68,13.75,41.29-9.15,32.44-68.35,20.55-46.93-24.78,2.2-4.65,15.98-28.23,19.6-29.32Z"/>
          <path fill="#5d88c6" d="M356.76,405.21c6.32-2.23,12.08,9.45,15.1,14.14,9.6,14.92,21.53,34.38,6.92,50.34-18.71,20.44-54.82,1.27-43.64-28.87,1.83-4.94,18.25-34.43,21.62-35.61Z"/>
          <path fill="#bababa" d="M116.96,279.66c.53.86.24,3.53-.33,4.5-1.62,2.77-10.49,1.08-13.44.51-42.59-8.31-59.82-61.9-29.48-93.27,2.37-2.45,10.56-9.82,13.9-7.45,3.4,5.51-2.46,6.47-5.61,9.28-29,25.9-18.06,74.43,19.59,83.8,2.71.67,14.96,1.96,15.37,2.63Z"/>
          <path fill="#bababa" d="M361.35,104.3c4.9-1.6,16.54,1.21,21.55,3.11,20.39,7.74,36.2,29.61,36.09,51.68-.03,5.54-4.84,8.6-7,4.15-.99-2.03-.93-12.21-2.03-16.42-4.54-17.33-19.63-31.24-37.01-34.99-2.35-.51-11.55-1.13-12.24-1.6-1.48-1.01-1.44-5.24.65-5.93Z"/>
          <path fill="#bababa" d="M259,58.25c1.59,1.58,1.45,4.75-.69,5.77s-10.83,1.08-14.58,2.03c-9.79,2.49-20.33,9.87-26.41,17.89-2.24,2.95-6.33,13.01-7.38,13.85-4.18,3.36-6.6-.83-4.94-5.87,4.83-14.69,21.93-28.78,36.69-32.53,3.27-.83,15.23-3.22,17.31-1.15Z"/>
          <path fill="#fff" d="M280.24,333.31c34.81-4.92,34.96,54.21-.94,48.45-22.81-3.66-23.52-45,.94-48.45Z"/>
          <path fill="#fff" d="M223.94,282.55c38.75-5.77,33.91,58.36-2.56,47.31-20.72-6.28-19.11-44.08,2.56-47.31Z"/>
          <path fill="#fff" d="M282.97,283.39c4.77-1.4,7.26,2.85,5.08,6.97l-54.26,86.95c-3.47,6.54-11.53,3.48-8.91-3.37,18.15-26.75,33.42-55.57,51.51-82.33,1.4-2.07,4.48-7.6,6.58-8.22Z"/>
          <path fill="#5d88c6" d="M281.14,342.52c19.66-3.51,18.58,27.39,6.97,30.04-20.46,4.68-20.36-27.66-6.97-30.04Z"/>
          <path fill="#5d88c6" d="M228.45,290.93c17.9-.51,16.93,35.99-3.4,30.62-11.99-3.16-11.81-30.19,3.4-30.62Z"/>
        </svg>
      );

    case 'wind':
      return (
        <svg viewBox="0 0 24 24" style={{...iconStyle, filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.4))'}} fill="none">
          <defs>
            <linearGradient id="windGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#BEF264', stopOpacity: 1 }} />
              <stop offset="25%" style={{ stopColor: '#86EFAC', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#4ADE80', stopOpacity: 1 }} />
              <stop offset="75%" style={{ stopColor: '#22C55E', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#16A34A', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="windHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.7 }} />
              <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 0 }} />
            </linearGradient>
            <filter id="windBlur">
              <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Wind stream lines with curved motion */}
          <g filter="url(#windBlur)">
            {/* Top wind line */}
            <path d="M2 5C2 4.45 2.45 4 3 4H18C18.55 4 19 4.45 19 5C19 5.55 18.55 6 18 6H3C2.45 6 2 5.55 2 5Z" fill="url(#windGradient)"/>
            <path d="M2 5C2 4.45 2.45 4 3 4H18C18.55 4 19 4.45 19 5C19 5.55 18.55 6 18 6H3C2.45 6 2 5.55 2 5Z" fill="url(#windHighlight)" opacity="0.5"/>
            <path d="M2 5C2 4.45 2.45 4 3 4H18C18.55 4 19 4.45 19 5C19 5.55 18.55 6 18 6H3C2.45 6 2 5.55 2 5Z" stroke="#15803D" strokeWidth="0.5"/>
            
            {/* Middle wind line */}
            <path d="M3 9C3 8.45 3.45 8 4 8H20C20.55 8 21 8.45 21 9C21 9.55 20.55 10 20 10H4C3.45 10 3 9.55 3 9Z" fill="url(#windGradient)"/>
            <path d="M3 9C3 8.45 3.45 8 4 8H20C20.55 8 21 8.45 21 9C21 9.55 20.55 10 20 10H4C3.45 10 3 9.55 3 9Z" fill="url(#windHighlight)" opacity="0.5"/>
            <path d="M3 9C3 8.45 3.45 8 4 8H20C20.55 8 21 8.45 21 9C21 9.55 20.55 10 20 10H4C3.45 10 3 9.55 3 9Z" stroke="#15803D" strokeWidth="0.5"/>
            
            {/* Lower wind line */}
            <path d="M5 13C5 12.45 5.45 12 6 12H18C18.55 12 19 12.45 19 13C19 13.55 18.55 14 18 14H6C5.45 14 5 13.55 5 13Z" fill="url(#windGradient)"/>
            <path d="M5 13C5 12.45 5.45 12 6 12H18C18.55 12 19 12.45 19 13C19 13.55 18.55 14 18 14H6C5.45 14 5 13.55 5 13Z" fill="url(#windHighlight)" opacity="0.5"/>
            <path d="M5 13C5 12.45 5.45 12 6 12H18C18.55 12 19 12.45 19 13C19 13.55 18.55 14 18 14H6C5.45 14 5 13.55 5 13Z" stroke="#15803D" strokeWidth="0.5"/>
            
            {/* Bottom wind line */}
            <path d="M7 17C7 16.45 7.45 16 8 16H16C16.55 16 17 16.45 17 17C17 17.55 16.55 18 16 18H8C7.45 18 7 17.55 7 17Z" fill="url(#windGradient)"/>
            <path d="M7 17C7 16.45 7.45 16 8 16H16C16.55 16 17 16.45 17 17C17 17.55 16.55 18 16 18H8C7.45 18 7 17.55 7 17Z" fill="url(#windHighlight)" opacity="0.5"/>
            <path d="M7 17C7 16.45 7.45 16 8 16H16C16.55 16 17 16.45 17 17C17 17.55 16.55 18 16 18H8C7.45 18 7 17.55 7 17Z" stroke="#15803D" strokeWidth="0.5"/>
          </g>
          
          {/* Wind direction arrows */}
          <g stroke="#16A34A" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L22 6L21 5L22 6L21 7"/>
            <path d="M22 10L24 10L23 9L24 10L23 11"/>
            <path d="M20 14L22 14L21 13L22 14L21 15"/>
            <path d="M18 18L20 18L19 17L20 18L19 19"/>
          </g>
        </svg>
      );

    case 'uv':
      return (
        <svg viewBox="0 0 24 24" style={{...iconStyle, filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.4))'}} fill="none">
          <defs>
            <radialGradient id="uvGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: '#FEF3C7', stopOpacity: 1 }} />
              <stop offset="30%" style={{ stopColor: '#FDE68A', stopOpacity: 1 }} />
              <stop offset="60%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#D97706', stopOpacity: 1 }} />
            </radialGradient>
            <radialGradient id="uvCore" cx="50%" cy="50%" r="30%">
              <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#FEF3C7', stopOpacity: 1 }} />
            </radialGradient>
            <filter id="uvGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="uvInnerGlow">
              <feGaussianBlur stdDeviation="1" result="innerBlur"/>
              <feMerge> 
                <feMergeNode in="innerBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Outer glow */}
          <circle cx="12" cy="12" r="10" fill="url(#uvGradient)" filter="url(#uvGlow)" opacity="0.8"/>
          {/* Main sun circle */}
          <circle cx="12" cy="12" r="8" fill="url(#uvGradient)" filter="url(#uvInnerGlow)"/>
          {/* Inner core */}
          <circle cx="12" cy="12" r="4" fill="url(#uvCore)"/>
          {/* Sun rays */}
          <g stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="22" y1="12" x2="18" y2="12"/>
            <line x1="6" y1="12" x2="2" y2="12"/>
            <line x1="18.36" y1="5.64" x2="15.88" y2="8.12"/>
            <line x1="8.12" y1="15.88" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="18.36" x2="15.88" y2="15.88"/>
            <line x1="8.12" y1="8.12" x2="5.64" y2="5.64"/>
          </g>
          {/* Outline */}
          <circle cx="12" cy="12" r="8" fill="none" stroke="#D97706" strokeWidth="0.5"/>
        </svg>
      );

    case 'refresh':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={color || 'currentColor'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={iconStyle}
        >
          <path d="M23 4v6h-6" />
          <path d="M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
          <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
        </svg>
      );

    default:
      return null;
  }
};

export default WeatherIcon; 