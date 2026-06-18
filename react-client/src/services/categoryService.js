import request from './api';

export const categoryService = {
  // Get all categories from the server
  getAll: () => request('/api/categories'),

  // Create a new category (Admin only)
  create: (categoryData) => request('/api/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  })
};
