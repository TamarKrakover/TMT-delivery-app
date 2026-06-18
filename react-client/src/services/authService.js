import request from './api';

export const authService = {
  // Register a new user
  register: (userData) => request('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  // Login and get token
  login: (username, password) => request('/api/tokens', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),

  // Get specific user details, allowing custom headers (used during login)
  getUserDetails: (userId, headers) => request(`/api/users/${userId}`, {
    headers: headers
  }),

  // Upload profile image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Image upload failed');
    }
    
    return await response.json();
  }
};
