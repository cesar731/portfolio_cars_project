import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAccessories, Accessory } from '../services/accessoryApi';
import { getCartItems, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart } from '../services/cartApi';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

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
    // 1. Primero, hacemos la llamada a la API
    const newItem = await apiAddToCart(user.id, accessoryId);

    // 2. Luego, actualizamos el estado local
    setCartItems(prev => {
      // Buscamos si el accesorio ya está en el carrito
      const existingItemIndex = prev.findIndex(item => item.accessory.id === accessoryId);

      if (existingItemIndex !== -1) {
        // Si existe, incrementamos la cantidad
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        // Si no existe, lo agregamos como un nuevo ítem
        // Obtenemos los datos completos del accesorio desde el estado global `accessories`
        const accessory = accessories.find(a => a.id === accessoryId);
        if (!accessory) {
          // Si por alguna razón no está en `accessories`, hacemos una llamada adicional
          // (Esto no debería pasar si `accessories` está bien cargado)
          return prev;
        }
        return [...prev, {
          id: newItem.id, // El ID del nuevo CartItem desde la API
          accessory: accessory, // El objeto completo del accesorio
          quantity: 1,
        }];
      }
    });

    // 3. Opcional: Mostrar una notificación de éxito
    toast.success('¡Producto agregado al carrito!');
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error('No se pudo agregar el producto al carrito.');
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