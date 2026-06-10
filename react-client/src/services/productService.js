import request from './api';

export const productService = {
  // Get all products of a restaurant
  getByRestaurantId: (restaurantId) => request(`/api/restaurants/${restaurantId}/products`),

  // Get specific product details
  getById: (restaurantId, productId) => request(`/api/restaurants/${restaurantId}/products/${productId}`),

  // Add a product to a restaurant
  create: (restaurantId, data) => request(`/api/restaurants/${restaurantId}/products`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Update a product's details
  update: (restaurantId, productId, data) => request(`/api/restaurants/${restaurantId}/products/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  // Delete a product from a restaurant
  delete: (restaurantId, productId) => request(`/api/restaurants/${restaurantId}/products/${productId}`, {
    method: 'DELETE'
  })
};
