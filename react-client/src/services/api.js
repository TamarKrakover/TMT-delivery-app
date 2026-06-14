// Base API request helper
const request = async (url, options = {}) => {
  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user ? user.id : 'temp_user';

  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': userId,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Something went wrong');
  }

  if (response.status === 204 || response.status === 201) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export default request;
