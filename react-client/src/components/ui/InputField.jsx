import React, { useState } from 'react';
import { FiEye, FiEyeOff } from '../../components/common/Icons';

const InputField = ({ 
  id, 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  hint,
  autoComplete 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <div className="input-field-wrapper">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`form-input ${error ? 'error' : ''} ${isPassword ? 'input-field-has-password' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle-btn"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <span className="form-error">{error}</span>
      ) : hint ? (
        <span className="form-hint">{hint}</span>
      ) : null}
    </div>
  );
};

export default InputField;
