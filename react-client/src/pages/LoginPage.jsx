import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import './Auth.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateInput = () => {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return false;
    }
    return true; 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInput()) return; 

    setIsLoading(true);
    try {
      const tokenData = await authService.login(username.trim(), password);
      
      // The token endpoint only returns the ID, so we need to fetch the full user details
      const fullUserData = await authService.getUserDetails(tokenData.id, {
        'x-user-id': tokenData.id
      });
      
      login(fullUserData);
      navigate('/'); 
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid username or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Sign in to order your favorite food">
      <form onSubmit={handleLogin} className="auth-form">
        <ErrorMessage message={error} />
        
        <InputField
          id="username"
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          error={error && !username ? 'Required field' : ''}
        />
        
        <InputField
          id="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          error={error && !password ? 'Required field' : ''}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="auth-links">
        Don't have an account? 
        <Link to="/register">Sign up</Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;