import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="global-error">
      {message}
    </div>
  );
};

export default ErrorMessage;
