import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAccessories, Accessory } from '../services/accessoryApi';
import { getCartItems, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart } from '../services/cartApi';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  accessory: Accessory;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (accessoryId: number) => void;
  removeFromCart: (cartItemId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const data = await getAccessories();
        setAccessories(data);
      } catch (error) {
        console.error('Error fetching accessories:', error);
      }
    };
    fetchAccessories();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      try {
        const items = await getCartItems(user.id);
        setCartItems(items.map(item => ({
          id: item.id,
          accessory: item.accessory!,
          quantity: item.quantity,
        })));
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, [user]);

  const handleAddToCart = async (accessoryId: number) => {
    if (!user) return;
    try {
      const newItem = await apiAddToCart(user.id, accessoryId);
      setCartItems(prev => {
        const existing = prev.find(item => item.accessory.id === accessoryId);
        if (existing) {
          return prev.map(item =>
            item.accessory.id === accessoryId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        const accessory = accessories.find(a => a.id === accessoryId);
        if (!accessory) return prev;
        return [...prev, { id: newItem.id, accessory, quantity: 1 }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleRemoveFromCart = async (cartItemId: number) => {
    if (!user) return;
    try {
      await apiRemoveFromCart(user.id, cartItemId);
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = { cartItems, addToCart: handleAddToCart, removeFromCart: handleRemoveFromCart, clearCart };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};