import React from 'react';

function Button({ children, onClick, disabled, loading, style, ...props }) {
  
  const baseStyles = {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    opacity: (disabled || loading) ? 0.6 : 1,
    transition: 'opacity 0.2s',
    width: '100%'
  };

  const finalStyles = {
    ...baseStyles,
    ...style, 
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={finalStyles}
      {...props}
    >
      {loading ? 'Завантаження...' : children}
    </button>
  );
}

export default Button;