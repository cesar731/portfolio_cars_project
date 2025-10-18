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
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('¡Pago realizado con éxito! Gracias por tu compra.');
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

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => sum + (item.accessory?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.19; // IVA del 19%
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-dark text-text">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Carrito de compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Productos */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-dark-light rounded-lg border border-border p-4 flex items-center">
                  <img
                    src={item.accessory?.image_url || 'https://via.placeholder.com/100x100?text=Accesorio'}
                    alt={item.accessory?.name || 'Accesorio'}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-text">{item.accessory?.name}</h3>
                    <p className="text-text-secondary text-sm mt-1">
                      ${item.accessory?.price?.toLocaleString()}
                    </p>
                    
                    {/* Controles de Cantidad */}
                    <div className="flex items-center mt-3 gap-3">
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                      <div className="flex items-center border border-border rounded">
                        <button
                          className="w-8 h-8 flex items-center justify-center text-text hover:bg-gray-700"
                          onClick={() => {
                            // Aquí iría la lógica para disminuir la cantidad
                            // Por ahora, solo eliminamos si es 1
                            if (item.quantity <= 1) {
                              handleRemoveFromCart(item.id);
                            }
                          }}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <button
                          className="w-8 h-8 flex items-center justify-center text-text hover:bg-gray-700"
                          onClick={() => {
                            // Aquí iría la lógica para aumentar la cantidad
                            toast.info('Función de actualizar cantidad no implementada aún.');
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">
                      ${(item.accessory?.price || 0 * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de Compra */}
          <div className="lg:col-span-1">
            <div className="bg-dark-light rounded-lg border border-border p-6 sticky top-24">
              <h2 className="text-xl font-bold text-text mb-4">Resumen de la compra</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-white">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">IVA (19%)</span>
                  <span className="text-white">${tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full mt-6 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {checkoutLoading ? 'Procesando...' : 'Comprar ahora'}
              </button>
              <Link
                to="/accessories"
                className="block w-full mt-3 py-2 text-center text-primary hover:text-primary/80 font-medium"
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;