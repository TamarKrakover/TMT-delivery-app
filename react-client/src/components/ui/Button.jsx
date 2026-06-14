import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  onClick, 
  disabled = false, 
  className = 'btn-primary auth-button' 
}) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
