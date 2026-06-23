import request from './api';

export const restaurantService = {
  // Get all restaurants
  getAll: () => request('/api/restaurants'),

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
  search: (query) => request(`/api/search/${query}`),

  // Get recommended products based on user and last viewed product
  getRecommendations: (productId) => request(`/api/restaurants/recommendations?productId=${productId}`)
};
