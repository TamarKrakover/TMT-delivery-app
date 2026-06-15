import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      return [];
    }
  });

  const [cartRestaurant, setCartRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('cart_restaurant');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to load cart restaurant from localStorage', e);
      return null;
    }
  });

  const [isCartOpen, setCartOpen] = useState(false);
  const [conflictItem, setConflictItem] = useState(null);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (cartRestaurant) {
      localStorage.setItem('cart_restaurant', JSON.stringify(cartRestaurant));
    } else {
      localStorage.removeItem('cart_restaurant');
    }
  }, [cartRestaurant]);

  const toggleCart = () => setCartOpen(prev => !prev);

  const addToCart = (product, restaurant) => {
    // If cart is empty, set the active restaurant and add item
    if (cartItems.length === 0 || !cartRestaurant) {
      const newRestaurant = { id: restaurant.id, name: restaurant.name };
      setCartRestaurant(newRestaurant);
      setCartItems([{ ...product, quantity: 1 }]);
      setCartOpen(true);
      return;
    }

    // Check if the item belongs to the same restaurant
    if (restaurant.id !== cartRestaurant.id) {
      setConflictItem({ product, restaurant });
      return;
    }

    // Add or increment the item
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (!existingItem) return prevItems;

      let updatedItems;
      if (existingItem.quantity <= 1) {
        updatedItems = prevItems.filter(item => item.id !== productId);
      } else {
        updatedItems = prevItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }

      if (updatedItems.length === 0) {
        setCartRestaurant(null);
      }
      return updatedItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCartItems(prevItems => {
        const updated = prevItems.filter(item => item.id !== productId);
        if (updated.length === 0) {
          setCartRestaurant(null);
        }
        return updated;
      });
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCartRestaurant(null);
    setConflictItem(null);
  };

  const confirmConflict = () => {
    if (conflictItem) {
      const { product, restaurant } = conflictItem;
      const newRestaurant = { id: restaurant.id, name: restaurant.name };
      setCartRestaurant(newRestaurant);
      setCartItems([{ ...product, quantity: 1 }]);
      setConflictItem(null);
      setCartOpen(true);
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
        confirmConflict,
        cancelConflict
      }}
    >
      {children}
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
