import request from './api';

export const restaurantService = {
  // Get all restaurants
  getAll: (lat, lng) => {
    const url = (lat !== undefined && lng !== undefined) ? `/api/restaurants?lat=${lat}&lng=${lng}` : '/api/restaurants';
    return request(url);
  },

  // Get specific restaurant by ID
  getById: (id) => request(`/api/restaurants/${id}`),

  // Create a new restaurant
  create: (data) => request('/api/restaurants', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Update an existing restaurant
  update: (id, data) => request(`/api/restaurants/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  // Delete a restaurant
  delete: (id) => request(`/api/restaurants/${id}`, {
    method: 'DELETE'
  }),

  // Search for restaurants or products matching query
  search: (query) => request(`/api/search/${query}`)
};
