 
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAccessories, Accessory } from '../services/accessoryApi';

interface CartItem {
  accessory: Accessory;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (accessoryId: number) => void;
  removeFromCart: (accessoryId: number) => void;
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

  const addToCart = (accessoryId: number) => {
    const accessory = accessories.find(a => a.id === accessoryId);
    if (!accessory) return;

    setCartItems(prev => {
      const existing = prev.find(item => item.accessory.id === accessoryId);
      if (existing) {
        return prev.map(item =>
          item.accessory.id === accessoryId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { accessory, quantity: 1 }];
    });
  };

  const removeFromCart = (accessoryId: number) => {
    setCartItems(prev => prev.filter(item => item.accessory.id !== accessoryId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = { cartItems, addToCart, removeFromCart, clearCart };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};