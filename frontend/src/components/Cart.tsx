// frontend/src/components/Cart.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Accessory } from '../types'; 
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      try {
        const response = await api.get(`/api/cart/${user.id}`);
        const cartData = response.data;
        const accessories = await Promise.all(
          cartData.map(async (item: any) => {
            const accessoryRes = await api.get(`/api/accessories/${item.accessory_id}`);
            return accessoryRes.data;
          })
        );
        setCartItems(accessories);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const removeFromCart = async (accessoryId: number) => {
    try {
      await api.delete(`/api/cart/${user?.id}/${accessoryId}`);
      setCartItems(cartItems.filter(item => item.id !== accessoryId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-dark text-text flex flex-col items-center justify-center p-12">
        <h2 className="text-2xl font-light text-text mb-4">Tu carrito está vacío</h2>
        <Link to="/accessories" className="px-6 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors">
          🛒 Ver Accesorios
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-light text-white mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-dark-light rounded-xl shadow-card border border-border p-6">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-text">{item.name}</h3>
              <p className="text-text-secondary mt-1">${item.price.toLocaleString()}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-right">
          <Link
            to="/checkout"
            className="px-8 py-4 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors text-lg"
          >
            Proceder al Pago
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;