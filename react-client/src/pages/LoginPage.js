import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  // state management for user input and error handling
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // hooks for routing and global state management
  const navigate = useNavigate();
  const { login } = useAuth();

  // validation for login 
  const validateInput = () => {
    setError('');
    
    // verify that the fields are not empty 
    if (!username || !password) {
      setError('All fields are required.');
      return false;
    }
    
    return true; 
  };

  // form submission handler
  const handleLogin = async (e) => {
    // prevent the default form submission behavior (page refresh)
    e.preventDefault();
    
    // stop execution if validation fails
    if (!validateInput()) {
      return; 
    }

    try {
      // send the login credentials to the backend server
      const response = await authService.login(username, password);
      
      // update the global application state to indicate the user is authenticated
      login(response);
      
      // navigate the user to the home page upon successful login
      navigate('/'); 
      
    } catch (err) {
      // handle server errors 
      console.error("Login failed:", err);
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Sign In</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Username Input Field */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        
        {/* Password Input Field */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        
        {/* Conditional rendering for error messages */}
        {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}
        
        {/* Submit Button */}
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', borderRadius: '5px' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;