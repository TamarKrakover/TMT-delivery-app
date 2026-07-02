import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { orderService, restaurantService, productService } from '../services/api';
import { Alert } from 'react-native';

const CartContext = createContext({
  cartItems: [],
  cartRestaurant: null,
  cartCalculation: { totalPrice: 0, items: [] },
  isCalculating: false,
  conflictItem: null,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  checkout: async () => {},
  confirmConflict: async () => {},
  cancelConflict: async () => {},
  fetchCart: async () => {},
  successItem: null,
  clearSuccess: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [cartRestaurant, setCartRestaurant] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [conflictItem, setConflictItem] = useState(null);
  const [successItem, setSuccessItem] = useState(null);
  const [cartCalculation, setCartCalculation] = useState({ totalPrice: 0, items: [] });
  const [isCalculating, setIsCalculating] = useState(false);
  const [checkoutTrigger, setCheckoutTrigger] = useState(0);

  const triggerSuccess = (product) => {
    setSuccessItem(product);
    setTimeout(() => {
      setSuccessItem(null);
    }, 1500);
  };

  const clearSuccess = () => setSuccessItem(null);

  const fetchCart = useCallback(async () => {
    if (!currentUser || currentUser.isGuest) {
      setCartItems([]);
      setCartRestaurant(null);
      setActiveOrderId(null);
      setCartCalculation({ totalPrice: 0, items: [] });
      return;
    }

    try {
      const orders = await orderService.getAll();
      const pendingOrder = orders.find(o => o.status === 'Pending');

      if (pendingOrder && pendingOrder.productIds && pendingOrder.productIds.length > 0) {
        setActiveOrderId(pendingOrder.id || pendingOrder._id);

        // Fetch restaurant details
        const restaurants = await restaurantService.getAll();
        const restaurant = restaurants.find(r => (r.id || r._id) === pendingOrder.restaurantId);
        if (restaurant) {
          setCartRestaurant({ id: restaurant.id || restaurant._id, name: restaurant.name });
        } else {
          setCartRestaurant({ id: pendingOrder.restaurantId, name: 'Unknown Restaurant' });
        }

        // Fetch products
        let products = [];
        try {
          products = await productService.getByRestaurantId(pendingOrder.restaurantId);
        } catch (e) {
        }

        // Count frequencies of productIds in pendingOrder
        const counts = {};
        pendingOrder.productIds.forEach(id => {
          counts[id] = (counts[id] || 0) + 1;
        });

        const items = [];
        for (const [pid, qty] of Object.entries(counts)) {
          let product = products.find(p => (p.id || p._id) === pid);
          if (!product) product = { id: pid, name: 'Unknown Product', price: 0 };
          items.push({ ...product, quantity: qty });
        }
        setCartItems(items);
      } else {
        if (pendingOrder) {
          setActiveOrderId(pendingOrder.id || pendingOrder._id);
        } else {
          setActiveOrderId(null);
        }
        setCartItems([]);
        setCartRestaurant(null);
        setCartCalculation({ totalPrice: 0, items: [] });
      }
    } catch (err) {
      setCartItems([]);
      setCartRestaurant(null);
      setActiveOrderId(null);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Recalculate price when cartItems or restaurant changes
  useEffect(() => {
    if (cartItems.length === 0 || !cartRestaurant) {
      setCartCalculation({ totalPrice: 0, items: [] });
      return;
    }

    const productIds = cartItems.reduce((acc, item) => {
      const pid = item.id || item._id;
      for (let i = 0; i < item.quantity; i++) {
        acc.push(pid);
      }
      return acc;
    }, []);

    setIsCalculating(true);
    orderService.calculate(cartRestaurant.id, productIds)
      .then(data => {
        if (data) {
          setCartCalculation(data);
        }
        setIsCalculating(false);
      })
      .catch(err => {
        setIsCalculating(false);
      });
  }, [cartItems, cartRestaurant]);

  const syncCartToServer = async (restaurantId, items) => {
    if (!currentUser) return;

    const productIds = [];
    items.forEach(item => {
      const pid = item.id || item._id;
      for (let i = 0; i < item.quantity; i++) {
        productIds.push(pid);
      }
    });

    try {
      if (productIds.length === 0) {
        if (activeOrderId) {
          await orderService.delete(activeOrderId);
          setActiveOrderId(null);
        }
      } else {
        if (activeOrderId) {
          await orderService.update(activeOrderId, { productIds });
        } else {
          const newOrder = await orderService.create(restaurantId, productIds);
          setActiveOrderId(newOrder.id || newOrder._id);
          fetchCart();
        }
      }
    } catch (err) {
      fetchCart(); // rollback on error
    }
  };

  const addToCart = async (product, restaurant) => {
    if (!currentUser || currentUser.isGuest) {
      return false;
    }

    const restId = restaurant.id || restaurant._id;
    const prodId = product.id || product._id;

    if (cartItems.length === 0 || !cartRestaurant) {
      const newItems = [{ ...product, quantity: 1 }];
      setCartRestaurant({ id: restId, name: restaurant.name });
      setCartItems(newItems);
      await syncCartToServer(restId, newItems);
      triggerSuccess(product);
      return true;
    }

    if (restId !== cartRestaurant.id) {
      setConflictItem({ product, restaurant });
      return false;
    }

    const newItems = [...cartItems];
    const existingIndex = newItems.findIndex(item => (item.id || item._id) === prodId);
    if (existingIndex >= 0) {
      newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + 1 };
    } else {
      newItems.push({ ...product, quantity: 1 });
    }
    setCartItems(newItems);
    await syncCartToServer(cartRestaurant.id, newItems);
    triggerSuccess(product);
    return true;
  };

  const removeFromCart = async (productId) => {
    let newItems = [...cartItems];
    const existingIndex = newItems.findIndex(item => (item.id || item._id) === productId);
    if (existingIndex < 0) return;

    newItems = newItems.filter(item => (item.id || item._id) !== productId);
    setCartItems(newItems);

    if (newItems.length === 0) {
      setCartRestaurant(null);
    }

    if (cartRestaurant) {
      await syncCartToServer(cartRestaurant.id, newItems);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    let newItems = [...cartItems];

    if (quantity <= 0) {
      newItems = newItems.filter(item => (item.id || item._id) !== productId);
    } else {
      const existingIndex = newItems.findIndex(item => (item.id || item._id) === productId);
      if (existingIndex >= 0) {
        newItems[existingIndex] = { ...newItems[existingIndex], quantity };
      }
    }

    setCartItems(newItems);
    if (newItems.length === 0) {
      setCartRestaurant(null);
    }

    if (cartRestaurant) {
      await syncCartToServer(cartRestaurant.id, newItems);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    setCartRestaurant(null);
    setConflictItem(null);
    setCartCalculation({ totalPrice: 0, items: [] });
    if (activeOrderId) {
      try {
        await orderService.delete(activeOrderId);
        setActiveOrderId(null);
      } catch (e) {
      }
    }
  };

  const checkout = async () => {
    if (!currentUser || !activeOrderId) return;
    try {
      await orderService.update(activeOrderId, { status: 'Processing' });
      setCartItems([]);
      setCartRestaurant(null);
      setActiveOrderId(null);
      setCartCalculation({ totalPrice: 0, items: [] });
      setCheckoutTrigger(prev => prev + 1);
    } catch (e) {
      throw e;
    }
  };

  const confirmConflict = async () => {
    if (conflictItem) {
      const { product, restaurant } = conflictItem;
      const restId = restaurant.id || restaurant._id;
      const prodId = product.id || product._id;
      const newItems = [{ ...product, quantity: 1 }];

      setCartRestaurant({ id: restId, name: restaurant.name });
      setCartItems(newItems);
      setConflictItem(null);

      try {
        if (activeOrderId) {
          await orderService.delete(activeOrderId);
        }
        const newOrder = await orderService.create(restId, [prodId]);
        setActiveOrderId(newOrder.id || newOrder._id);
        triggerSuccess(product);
      } catch (e) {
        fetchCart();
      }
    }
  };

  const cancelConflict = () => {
    setConflictItem(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartRestaurant,
        cartCalculation,
        isCalculating,
        conflictItem,
        successItem,
        clearSuccess,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        confirmConflict,
        cancelConflict,
        fetchCart,
        checkoutTrigger,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
