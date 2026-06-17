import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import '../components/common/Errors.css';

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="error-page-container">
        <img src="/logo.png" alt="TMT Logo" className="error-page-logo" />
        <h1 className="error-page-code danger">403</h1>
        <h2 className="error-page-title">Access Denied</h2>
        <p className="error-page-text">
          You don't have permission to access this resource or perform this action. 
          Please log in with an account that has the required privileges.
        </p>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            className="btn-outline error-page-btn" 
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
          <button 
            className="btn-primary error-page-btn" 
            onClick={() => navigate('/login')}
          >
            Log In
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForbiddenPage;
