import request from './api';

export const orderService = {
  // Create a new order
  create: (restaurantId, productIds) => request('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ restaurantId, productIds })
  }),

  // Get all orders of the logged-in user
  getAll: () => request('/api/orders'),

  // Get specific order details
  getById: (id) => request(`/api/orders/${id}`),

  // Update order products
  update: (id, productIds) => request(`/api/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ productIds })
  }),

  // Cancel/delete an order
  delete: (id) => request(`/api/orders/${id}`, {
    method: 'DELETE'
  })
};
