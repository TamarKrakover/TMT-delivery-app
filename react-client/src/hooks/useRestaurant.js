import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/restaurantService';
import { productService } from '../services/productService';

export const useRestaurant = (id, currentUser) => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRestaurantData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const restData = await restaurantService.getById(id);
      setRestaurant(restData);
      const prodData = await productService.getByRestaurantId(id);
      setProducts(prodData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load restaurant data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRestaurantData();
  }, [loadRestaurantData, currentUser]);

  const canModify = useCallback(() => {
    if (!currentUser || !restaurant) return false;
    return currentUser.id === restaurant.creatorId || currentUser.isAdmin;
  }, [currentUser, restaurant]);

  const updateRestaurant = async (form) => {
    if (!form.name || !form.address) {
      throw new Error('Name and Address are required fields.');
    }
    await restaurantService.update(id, form);
    await loadRestaurantData();
  };

  const deleteRestaurant = async () => {
    if (window.confirm(`Are you sure you want to delete ${restaurant.name}? This will remove all its menu items.`)) {
      await restaurantService.delete(id);
      navigate('/');
    }
  };

  const submitProduct = async (productFormMode, selectedProdId, form) => {
    if (!form.name || form.price === '') {
      throw new Error('Name and Price are required.');
    }
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      throw new Error('Price must be a positive number.');
    }

    if (productFormMode === 'add') {
      await productService.create(id, { ...form, price: priceNum });
    } else {
      await productService.update(id, selectedProdId, { ...form, price: priceNum });
    }
    await loadRestaurantData();
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      await productService.delete(id, productId);
      await loadRestaurantData();
    }
  };

  return {
    restaurant,
    products,
    loading,
    error,
    canModify: canModify(),
    updateRestaurant,
    deleteRestaurant,
    submitProduct,
    deleteProduct
  };
};
