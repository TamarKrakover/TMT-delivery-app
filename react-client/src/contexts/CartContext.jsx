import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { orderService } from '../services/orderService';
import { restaurantService } from '../services/restaurantService';
import { productService } from '../services/productService';
import ConfirmModal from '../components/modals/ConfirmModal';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [cartItems, setCartItems] = useState([]);
  const [cartRestaurant, setCartRestaurant] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [isCartOpen, setCartOpen] = useState(false);
  const [conflictItem, setConflictItem] = useState(null);
  const [checkoutTrigger, setCheckoutTrigger] = useState(0);
  const [authAlertOpen, setAuthAlertOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!currentUser) {
      setCartItems([]);
      setCartRestaurant(null);
      setActiveOrderId(null);
      return;
    }

    try {
      const orders = await orderService.getAll();
      const pendingOrder = orders.find(o => o.status === 'Pending');

      if (pendingOrder && pendingOrder.productIds && pendingOrder.productIds.length > 0) {
        setActiveOrderId(pendingOrder.id);
        
        // Fetch restaurant
        const restaurants = await restaurantService.getAll();
        const restaurant = restaurants.find(r => r.id === pendingOrder.restaurantId);
        if (restaurant) {
          setCartRestaurant({ id: restaurant.id, name: restaurant.name });
        } else {
          setCartRestaurant({ id: pendingOrder.restaurantId, name: 'Unknown' });
        }

        // Fetch products
        let products = [];
        try {
          products = await productService.getByRestaurantId(pendingOrder.restaurantId);
        } catch (e) {
          console.error("Could not fetch products", e);
        }
        
        // Count frequencies
        const counts = {};
        pendingOrder.productIds.forEach(id => {
          counts[id] = (counts[id] || 0) + 1;
        });

        const items = [];
        for (const [pid, qty] of Object.entries(counts)) {
          let product = products.find(p => p.id === pid);
          if (!product) product = { id: pid, name: 'Unknown Product', price: 0 };
          items.push({ ...product, quantity: qty });
        }
        setCartItems(items);
      } else {
        if (pendingOrder) {
          // Empty pending order found
          setActiveOrderId(pendingOrder.id);
        } else {
          setActiveOrderId(null);
        }
        setCartItems([]);
        setCartRestaurant(null);
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
      setCartItems([]);
      setCartRestaurant(null);
      setActiveOrderId(null);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const toggleCart = () => setCartOpen(prev => !prev);

  const syncCartToServer = async (restaurantId, items) => {
    if (!currentUser) return;
    
    const productIds = [];
    items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        productIds.push(item.id);
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
          // fetchCart to get the new order ID reliably
          fetchCart();
        }
      }
    } catch (err) {
      console.error("Failed to sync cart", err);
      fetchCart(); // rollback on error
    }
  };

  const addToCart = async (product, restaurant) => {
    if (!currentUser) {
      setAuthAlertOpen(true);
      return;
    }

    if (cartItems.length === 0 || !cartRestaurant) {
      const newItems = [{ ...product, quantity: 1 }];
      setCartRestaurant({ id: restaurant.id, name: restaurant.name });
      setCartItems(newItems);
      setCartOpen(true);
      await syncCartToServer(restaurant.id, newItems);
      return;
    }

    if (restaurant.id !== cartRestaurant.id) {
      setConflictItem({ product, restaurant });
      return;
    }

    const newItems = [...cartItems];
    const existingIndex = newItems.findIndex(item => item.id === product.id);
    if (existingIndex >= 0) {
      newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + 1 };
    } else {
      newItems.push({ ...product, quantity: 1 });
    }
    setCartItems(newItems);
    setCartOpen(true);
    await syncCartToServer(cartRestaurant.id, newItems);
  };

  const removeFromCart = async (productId) => {
    let newItems = [...cartItems];
    const existingIndex = newItems.findIndex(item => item.id === productId);
    if (existingIndex < 0) return;

    if (newItems[existingIndex].quantity <= 1) {
      newItems = newItems.filter(item => item.id !== productId);
    } else {
      newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity - 1 };
    }

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
      newItems = newItems.filter(item => item.id !== productId);
    } else {
      const existingIndex = newItems.findIndex(item => item.id === productId);
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
    if (activeOrderId) {
      try {
        await orderService.delete(activeOrderId);
        setActiveOrderId(null);
      } catch (e) {
        console.error("Failed to clear cart", e);
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
      setCheckoutTrigger(prev => prev + 1); // Trigger a refresh for other components
    } catch (e) {
      console.error("Failed to checkout", e);
      throw e;
    }
  };

  const confirmConflict = async () => {
    if (conflictItem) {
      const { product, restaurant } = conflictItem;
      const newItems = [{ ...product, quantity: 1 }];
      
      setCartRestaurant({ id: restaurant.id, name: restaurant.name });
      setCartItems(newItems);
      setConflictItem(null);
      setCartOpen(true);
      
      try {
        // Since we are changing the restaurant, we must delete the old order and create a new one
        if (activeOrderId) {
          await orderService.delete(activeOrderId);
        }
        const newOrder = await orderService.create(restaurant.id, [product.id]);
        setActiveOrderId(newOrder.id);
      } catch (e) {
        console.error("Failed to switch cart", e);
        fetchCart(); // Re-fetch on error
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
        isCartOpen,
        conflictItem,
        setCartOpen,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        confirmConflict,
        cancelConflict,
        checkoutTrigger
      }}
    >
      {children}
      <ConfirmModal
        isOpen={authAlertOpen}
        title="Authentication Required"
        message="Please sign in to add items to your cart."
        onClose={() => setAuthAlertOpen(false)}
        hideCancel={true}
        confirmText="OK"
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
