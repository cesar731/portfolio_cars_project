import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAccessories } from '../services/accessoryApi';
import {
  getCartItems,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
} from '../services/cartApi';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';
import { Accessory, CartItem as ApiCartItem } from '../types';

// ======================
// TYPES
// ======================
interface CartItem {
  id: number;
  accessory: Accessory;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (accessoryId: number, quantity?: number) => void;
  removeFromCart: (cartItemId: number) => void;
  clearCart: () => void;
}

// ======================
// CONTEXT
// ======================
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

// ======================
// PROVIDER
// ======================
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const { user } = useAuth();

  // ----------------------
  // Load accessories
  // ----------------------
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

  // ----------------------
  // Load cart
  // ----------------------
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;

      try {
        const items: ApiCartItem[] = await getCartItems(user.id);

        setCartItems(
          items
            .filter((item) => item.accessory) // seguridad
            .map((item) => ({
              id: item.id,
              accessory: item.accessory!,
              quantity: item.quantity,
            }))
        );
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [user]);

  // ----------------------
  // Add to cart
  // ----------------------
  const handleAddToCart = async (accessoryId: number, quantity: number = 1) => {
    if (!user || quantity <= 0) return;

    try {
      const newItem = await apiAddToCart(user.id, accessoryId, quantity);

      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.accessory.id === accessoryId
        );

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }

        const accessory = accessories.find((a) => a.id === accessoryId);
        if (!accessory) return prev;

        return [
          ...prev,
          {
            id: newItem.id,
            accessory,
            quantity,
          },
        ];
      });

      toast.success(
        `¡${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} agregada(s) al carrito!`
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('No se pudo agregar el producto al carrito.');
    }
  };

  // ----------------------
  // Remove from cart
  // ----------------------
  const handleRemoveFromCart = async (cartItemId: number) => {
    if (!user) return;

    try {
      await apiRemoveFromCart(user.id, cartItemId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // ----------------------
  // Clear cart
  // ----------------------
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ======================
// HOOK
// ======================
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
