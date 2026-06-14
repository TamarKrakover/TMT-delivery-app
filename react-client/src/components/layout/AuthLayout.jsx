import React from 'react';
import '../../pages/Auth.css';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        {title && <h2>{title}</h2>}
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
