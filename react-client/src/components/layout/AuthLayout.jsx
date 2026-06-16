import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../logoTMT.svg';
import '../../pages/Auth.css';

const AuthLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div 
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', cursor: 'pointer' }}
          onClick={() => navigate('/')}
          title="Return to Home Page"
        >
          <img src={logo} alt="TMT Logo" style={{ height: '50px' }} />
        </div>
        {title && <h2>{title}</h2>}
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
