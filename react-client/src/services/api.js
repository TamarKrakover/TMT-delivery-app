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

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export default request;
