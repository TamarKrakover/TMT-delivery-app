import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import AuthLayout from '../components/layout/AuthLayout';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import './Auth.css';

const RegisterPage = () => {
  // State management
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('customer');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  // Image state
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Clear error for profile pic if any
      setFieldErrors(prev => ({ ...prev, profilePic: null }));
    }
  };

  const validateInput = () => {
    const errors = {};
    let isValid = true;

    // Check required fields
    if (!username.trim()) errors.username = 'Username is required';
    if (!displayName.trim()) errors.displayName = 'Display name is required';
    if (!lat || !lng) errors.location = 'Latitude and Longitude are required';

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else {
      const isLengthValid = password.length >= 8;
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!isLengthValid || !hasLetter || !hasSpecialChar) {
        errors.password = 'Password must be 8+ chars, include a letter and a special character';
      }
    }

    if (password !== verifyPassword) {
      errors.verifyPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below.');
      isValid = false;
    } else {
      setFieldErrors({});
      setError('');
    }

    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
      if (!validateInput()) return;

      setIsLoading(true);
      try {
        let finalPicUrl = '';
        if (profilePic) {
          const uploadRes = await authService.uploadImage(profilePic);
          finalPicUrl = uploadRes.url;
        }

        const userData = {
          username: username.trim(),
          password,
          name: displayName,
          role: role,
          location: { lat: parseFloat(lat), lng: parseFloat(lng) },
          profilePic: finalPicUrl
        };

        await authService.register(userData);

        // Navigate to login after successful registration
        navigate('/login');
      } catch (err) {
        console.error("Registration failed:", err);
        if (err.message === 'Username already exists') {
          setError('This username is already taken. Please choose another one.');
          setFieldErrors(prev => ({ ...prev, username: 'Username already exists' }));
        } else {
          setError('Registration failed. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <AuthLayout title="Create an Account" subtitle="Join us to start ordering">
        <form onSubmit={handleRegister} className="auth-form">
          <ErrorMessage message={error} />

          <InputField
            id="username"
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={fieldErrors.username}
          />

          <InputField
            id="displayName"
            label="Display Name"
            placeholder="What should we call you?"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            error={fieldErrors.displayName}
          />

          <SelectField
            id="role"
            label="Account Type"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'customer', label: 'Regular User' },
              { value: 'owner', label: 'Restaurant Owner' }
            ]}
          />

          <InputField
            id="password"
            type="password"
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            hint={!fieldErrors.password ? "Min 8 characters, 1 letter, 1 special character" : null}
          />

          <InputField
            id="verifyPassword"
            type="password"
            label="Verify Password"
            placeholder="Confirm your password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            error={fieldErrors.verifyPassword}
          />

          <div className="form-group">
            <label>Profile Picture (Optional)</label>
            <div className="image-upload-container">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="image-preview" />
              ) : (
                <div className="profile-avatar-placeholder" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                  {(displayName || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              <div className="upload-btn-wrapper">
                <Button 
                  type="button" 
                  className="btn-outline"
                  onClick={() => fileInputRef.current.click()}
                >
                  Choose Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {fieldErrors.profilePic && <span className="error-message">{fieldErrors.profilePic}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Your Location (Coordinates)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <InputField
                id="lat"
                type="number"
                placeholder="Latitude (e.g. 32.08)"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                step="any"
              />
              <InputField
                id="lng"
                type="number"
                placeholder="Longitude (e.g. 34.78)"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                step="any"
              />
            </div>
            {fieldErrors.location && <span className="error-message" style={{ display: 'block', marginTop: '-10px', marginBottom: '10px' }}>{fieldErrors.location}</span>}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="auth-links">
          Already have an account?
          <Link to="/login">Sign in</Link>
        </div>
      </AuthLayout>
    );
  };

  export default RegisterPage;