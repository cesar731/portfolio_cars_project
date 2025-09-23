// frontend/src/pages/Cart.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getCartItems, removeFromCart } from '../services/cartApi';
import { CartItem } from '../types';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchCart = async () => {
      try {
        const items = await getCartItems(user.id);
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Error al cargar el carrito.');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user, navigate]);

  const handleRemoveFromCart = async (itemId: number) => {
    if (!user) return;
    try {
      await removeFromCart(user.id, itemId);
      setCartItems(cartItems.filter(item => item.id !== itemId));
      toast.success('Producto eliminado del carrito.');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Error al eliminar el producto.');
    }
  };

  const handleCheckout = async () => {
    if (!user) return;
    setCheckoutLoading(true);
    try {
      // ✅ ¡SIMULAMOS EL PROCESO DE PAGO!
      // En una aplicación real, aquí llamarías a una API de Stripe, PayPal, etc.
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simula un retraso de 2 segundos
      toast.success('¡Pago realizado con éxito! Gracias por tu compra.');
      // Limpiar el carrito después del pago
      setCartItems([]);
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Error al procesar el pago. Inténtalo nuevamente.');
    } finally {
      setCheckoutLoading(false);
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

  // Calcular el total
  const total = cartItems.reduce((sum, item) => sum + (item.accessory?.price || 0) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-dark text-text">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-light text-white mb-8">Carrito de Compras</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-dark-light rounded-xl shadow-card border border-border p-6">
              <img
                src={item.accessory?.image_url || 'https://via.placeholder.com/300x200?text=Accesorio'}
                alt={item.accessory?.name || 'Accesorio'}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-text">{item.accessory?.name}</h3>
              <p className="text-text-secondary mt-1">
                ${item.accessory?.price?.toLocaleString()} x {item.quantity}
              </p>
              <p className="text-primary font-bold mt-2">
                Subtotal: ${(item.accessory?.price || 0 * item.quantity).toLocaleString()}
              </p>
              <button
                onClick={() => handleRemoveFromCart(item.id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex justify-between items-center text-2xl font-bold text-white mb-8">
            <span>Total:</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="px-8 py-4 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {checkoutLoading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-text"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Proceder al Pago
                </>
              )}
            </button>
            <Link
              to="/accessories"
              className="px-8 py-4 bg-dark border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors text-center"
            >
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;