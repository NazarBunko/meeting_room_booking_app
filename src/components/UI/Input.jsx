import React from 'react';

function Input(props) {
  return (
    <input 
      style={{ 
        padding: '10px', 
        margin: '5px 0', 
        border: '1px solid #ccc', 
        borderRadius: '4px', 
        width: '100%',
        boxSizing: 'border-box',
        display: 'block' 
      }}
      {...props} 
    />
  );
}

export default Input;