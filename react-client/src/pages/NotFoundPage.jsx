import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import '../components/common/Errors.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="error-page-container">
        <img src="/logo.png" alt="TMT Logo" className="error-page-logo" />
        <h1 className="error-page-code primary">404</h1>
        <h2 className="error-page-title">Page Not Found</h2>
        <p className="error-page-text">
          Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        <button 
          className="btn-primary error-page-btn" 
          onClick={() => navigate('/')}
        >
          Go Back Home
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
