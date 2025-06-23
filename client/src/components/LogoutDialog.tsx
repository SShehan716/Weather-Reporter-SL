import React from 'react';

interface LogoutDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
};

const dialogStyle: React.CSSProperties = {
  background: '#1F2937',
  color: '#fff',
  borderRadius: '12px',
  padding: '2rem 1.5rem',
  minWidth: '260px',
  maxWidth: '90vw',
  boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
  textAlign: 'center',
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginTop: '1.5rem',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
};

const LogoutDialog: React.FC<LogoutDialogProps> = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <div style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Do you want to logout?</div>
        <div style={buttonRowStyle}>
          <button style={{ ...buttonStyle, background: '#EF4444', color: '#fff' }} onClick={onConfirm}>Yes</button>
          <button style={{ ...buttonStyle, background: '#374151', color: '#fff' }} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutDialog; 