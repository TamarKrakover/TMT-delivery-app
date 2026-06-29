import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getDevAPIUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }
  return 'http://localhost:8080';
};

const getBaseURL = () => {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (!url) {
    return getDevAPIUrl();
  }
  if (Platform.OS === 'android' && url.includes('localhost')) {
    return url.replace('localhost', '10.0.2.2');
  }
  return url;
};

export const BASE_URL = getBaseURL();


const USER_SESSION_KEY = 'user_session';

/**
 * Get the current user's session from AsyncStorage
 */
export const getUserSession = async () => {
  try {
    const session = await AsyncStorage.getItem(USER_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error reading user session:', error);
    return null;
  }
};

export const getLastViewedProduct = async (userId) => {
  try {
    const data = await AsyncStorage.getItem(`lastViewedProduct_${userId}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const setLastViewedProduct = async (userId, product) => {
  try {
    await AsyncStorage.setItem(`lastViewedProduct_${userId}`, JSON.stringify(product));
  } catch (e) {
    console.error('Failed to save last viewed product', e);
  }
};

/**
 * Set the current user's session in AsyncStorage
 */
export const setUserSession = async (userSession) => {
  try {
    await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(userSession));
  } catch (error) {
    console.error('Error saving user session:', error);
  }
};

/**
 * Clear the current user's session (Logout)
 */
export const clearUserSession = async () => {
  try {
    await AsyncStorage.removeItem(USER_SESSION_KEY);
  } catch (error) {
    console.error('Error clearing user session:', error);
  }
};

/**
 * Generic request helper with automatic header injection
 */
export const apiRequest = async (endpoint, options = {}) => {
  const session = await getUserSession();
  const userId = session ? session.id : 'temp_user';

  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': userId,
    ...options.headers,
  };

  const url = `${BASE_URL}${endpoint}`;

  // If body is FormData or explicitly flagged as multipart, don't set Content-Type header manually (let fetch determine boundaries)
  if (options.body instanceof FormData || options.isMultipart || (options.body && options.body.constructor && options.body.constructor.name === 'FormData')) {
    delete headers['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Something went wrong');
  }

  // HTTP 201 (Created) and 204 (No Content) might not return body content
  if (response.status === 201 || response.status === 204) {
    // If there is location header returned (e.g. for registration), parse it
    const location = response.headers.get('location');
    const text = await response.text();
    let body = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch (e) { }
    }
    return { location, body };
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

/**
 * Authentication and User Services
 */
export const authService = {
  // Login: POST /api/tokens
  login: async (username, password) => {
    const result = await apiRequest('/api/tokens', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    // result is { id: userId }
    return result;
  },

  // Register: POST /api/users
  register: async (userData) => {
    return await apiRequest('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Fetch specific user details
  getUserDetails: async (userId, customId) => {
    const headers = customId ? { 'x-user-id': customId } : {};
    return await apiRequest(`/api/users/${userId}`, {
      headers,
    });
  },

  // Upload image to backend
  uploadImage: async (imageAsset) => {
    const formData = new FormData();

    // Convert the local image URI to a standard Blob object using XMLHttpRequest (reliable on both Web and Android file:// URIs)
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.error('XHR error converting URI to Blob:', e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", imageAsset.uri, true);
      xhr.send(null);
    });

    const mimeType = blob.type || 'image/jpeg';
    const fileExt = mimeType.split('/')[1] || 'jpeg';

    formData.append('image', blob, `photo.${fileExt}`);

    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
      // No headers to let browser/native set boundary
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Image upload failed response:', errText);
      throw new Error('Image upload failed');
    }

    return await response.json(); // returns { url: "/api/uploads/misc/..." }
  },
};

export const categoryService = {
  getAll: async () => {
    return await apiRequest('/api/categories');
  },
  create: async (data) => {
    return await apiRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};

export const uploadService = {
  uploadImage: async (uri) => {
    const formData = new FormData();
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('image', { uri, name: filename, type });

    return await apiRequest('/api/upload', {
      method: 'POST',
      body: formData,
      isMultipart: true,
    });
  }
};

export const restaurantService = {
  getAll: async () => {
    return await apiRequest('/api/restaurants');
  },
  getById: async (id) => {
    return await apiRequest(`/api/restaurants/${id}`);
  },
  getRecommendations: async (productId) => {
    return await apiRequest(`/api/restaurants/recommendations?productId=${productId}`);
  },
  search: async (query) => {
    return await apiRequest(`/api/search/${query}`);
  }
};

export const productService = {
  getByRestaurantId: async (restaurantId) => {
    return await apiRequest(`/api/restaurants/${restaurantId}/products`);
  },
  getById: async (restaurantId, productId) => {
    return await apiRequest(`/api/restaurants/${restaurantId}/products/${productId}`);
  },
  getByGlobalId: async (productId) => {
    return await apiRequest(`/api/products/${productId}`);
  },
  getRecommendations: async (userId, productId) => {
    return await apiRequest(`/api/recommendations/${userId}/${productId}`);
  }
};

export const orderService = {
  create: async (restaurantId, productIds) => {
    return await apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ restaurantId, productIds })
    });
  },
  getAll: async () => {
    return await apiRequest('/api/orders');
  },
  getById: async (id) => {
    return await apiRequest(`/api/orders/${id}`);
  },
  update: async (id, data) => {
    return await apiRequest(`/api/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },
  delete: async (id) => {
    return await apiRequest(`/api/orders/${id}`, {
      method: 'DELETE'
    });
  },
  calculate: async (restaurantId, productIds) => {
    return await apiRequest('/api/orders/calculate', {
      method: 'POST',
      body: JSON.stringify({ restaurantId, productIds })
    });
  }
};

export const userService = {
  getUserByUsername: async (username) => {
    return await apiRequest('/api/users');
  },
  getUserById: async (userId) => {
    return await apiRequest(`/api/users/${userId}`);
  }
};

