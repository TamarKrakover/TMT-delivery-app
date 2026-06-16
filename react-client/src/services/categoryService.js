import request from './api';

export const categoryService = {
  // Get all categories with counts
  getAll: () => request('/api/categories')
};
