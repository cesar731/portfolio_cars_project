// frontend/src/pages/Cart.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, removeFromCart } = useCart();
  const [cartWithDetails, setCartWithDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadCartDetails = async () => {
      if (cartItems.length === 0) {
        setCartWithDetails([]);
        setLoading(false);
        return;
      }

      try {
        const itemsWithDetails = cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          accessory: item.accessory
        }));
        setCartWithDetails(itemsWithDetails);
      } catch (error) {
        toast.error('Error al cargar los detalles del carrito');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCartDetails();
  }, [cartItems]);

  const handleRemoveItem = (cartItemId: number) => {
    removeFromCart(cartItemId);
    toast.success('Producto eliminado del carrito');
  };

  const calculateTotal = () =>
    cartWithDetails.reduce(
      (total, item) => total + item.accessory.price * item.quantity,
      0
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text flex flex-col items-center py-8">
      <div className="w-full max-w-6xl px-6">
        <h1 className="text-4xl font-light text-white mb-10 text-center">
          🛒 Carrito de Compras
        </h1>

        {cartWithDetails.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-light text-text-secondary mb-6">
              Tu carrito está vacío
            </h2>
            <Link
              to="/accessories"
              className="px-6 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Ver Accesorios
            </Link>
          </div>
        ) : (
          <>
            {/* === Tabla de productos === */}
            <div className="bg-dark-light rounded-xl border border-border shadow-lg overflow-hidden mb-10">
              <table className="w-full">
                <thead className="border-b border-border/30 bg-dark/40">
                  <tr>
                    <th className="text-left py-4 px-6 text-text-secondary font-medium">
                      Producto
                    </th>
                    <th className="text-center py-4 px-6 text-text-secondary font-medium">
                      Cantidad
                    </th>
                    <th className="text-right py-4 px-6 text-text-secondary font-medium">
                      Precio
                    </th>
                    <th className="text-right py-4 px-6 text-text-secondary font-medium">
                      Total
                    </th>
                    <th className="text-center py-4 px-6 text-text-secondary font-medium">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartWithDetails.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border/10 hover:bg-dark/30 transition"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.accessory.image_url}
                            alt={item.accessory.name}
                            className="w-16 h-16 object-cover rounded-lg border border-border"
                          />
                          <div>
                            <h3 className="font-medium text-text mb-1">
                              {item.accessory.name}
                            </h3>
                            <p className="text-text-secondary text-sm mb-1">
                              {item.accessory.category}
                            </p>
                            {item.accessory.stock <= 0 && (
                              <span className="text-red-400 text-xs">
                                Agotado
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-6 text-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-dark border border-border rounded text-text">
                          {item.quantity}
                        </span>
                      </td>

                      <td className="py-5 px-6 text-right">
                        ${item.accessory.price.toLocaleString()}
                      </td>

                      <td className="py-5 px-6 text-right font-medium text-primary">
                        ${(item.accessory.price * item.quantity).toLocaleString()}
                      </td>

                      <td className="py-5 px-6 text-center">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition"
                          aria-label="Eliminar del carrito"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 
                              4v6m4-6v6m1-10V4a1 1 0 
                              00-1-1h-4a1 1 0 00-1 
                              1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* === Resumen de compra === */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-10">
              <div className="md:w-2/3">
                <Link
                  to="/accessories"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition"
                >
                  ← Seguir comprando
                </Link>
              </div>

              <div className="md:w-1/3 bg-dark-light rounded-xl p-6 border border-border shadow-md">
                <h2 className="text-2xl font-semibold text-text mb-6 text-center">
                  Resumen de la compra
                </h2>

                <div className="space-y-4 text-base">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">
                      Subtotal ({cartWithDetails.length}{' '}
                      {cartWithDetails.length === 1
                        ? 'producto'
                        : 'productos'})
                    </span>
                    <span className="text-text">
                      ${calculateTotal().toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-text-secondary">Envío</span>
                    <span className="text-text">Gratis</span>
                  </div>

                  <div className="border-t border-border/30 pt-4 flex justify-between text-lg font-semibold text-text">
                    <span>Total</span>
                    <span className="text-primary">
                      ${calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
  to="/checkout"
  className="w-full mt-8 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition"
>
  Proceder al Pago
</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
