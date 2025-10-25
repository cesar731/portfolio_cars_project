// frontend/src/pages/Cart.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { getCartItems, removeFromCart } from '../services/cartApi';
import { CartItem } from '../types';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<'personal' | 'card'>('personal');

  // Datos personales
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Datos de tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchCart = async () => {
      try {
        const items = await getCartItems(user.id);
        // El contexto ya lo maneja
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
      toast.success('Producto eliminado del carrito.');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Error al eliminar el producto.');
    }
  };

  const openModal = () => {
    if (cartItems.length === 0) {
      toast.error('Tu carrito está vacío.');
      return;
    }
    setName(user?.username || '');
    setEmail(user?.email || '');
    setShowModal(true);
    setStep('personal');
  };

  const handleNext = () => {
    if (!name.trim() || !address.trim() || !municipality.trim() || !country.trim() || !postalCode.trim() || !email.trim() || !phone.trim()) {
      toast.error('Por favor completa todos los campos.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor ingresa un correo válido.');
      return;
    }
    setStep('card');
  };

  const handleBack = () => {
    setStep('personal');
  };

  const cardType = (number: string): string => {
    const num = number.replace(/\s+/g, '');
    if (/^4/.test(num)) return 'Visa';
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'Mastercard';
    if (/^3[47]/.test(num)) return 'American Express';
    if (/^6011|^6[45]/.test(num)) return 'Discover';
    return 'Desconocida';
  };

  const handleCheckout = async () => {
    if (!cardNumber || !cardName || !expiry || !cvv) {
      toast.error('Por favor completa todos los campos de la tarjeta.');
      return;
    }
    if (cardType(cardNumber) === 'Desconocida') {
      toast.error('Tipo de tarjeta no soportada.');
      return;
    }

    setCheckoutLoading(true);
    try {
      // Simular pago
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Limpiar carrito
      clearCart();

      // Cerrar modal
      setShowModal(false);

      // Mostrar notificación de éxito
      toast.success(
        <>
          <div className="text-center">
            <div className="text-2xl">🎉 ¡Gracias por tu compra!</div>
            <div className="mt-2 text-sm">
              Tu pedido está en camino y la factura llegará a <strong>{email}</strong> en los próximos minutos.
            </div>
            <div className="mt-2 text-xs text-gray-300">
              ¡Disfruta tu nueva experiencia automotriz!
            </div>
          </div>
        </>,
        { duration: 6000 }
      );

      // Redirigir a accesorios
      setTimeout(() => navigate('/accessories'), 2500);
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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.accessory?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.19;
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
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="mt-3 text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">
                      ${(item.accessory?.price || 0) * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-dark-light rounded-lg border border-border p-6 sticky top-24">
              <h2 className="text-xl font-bold text-text mb-4">Resumen de la compra</h2>
              <div className="space-y-3 mb-6">
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
                onClick={openModal}
                className="w-full mt-4 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Comprar ahora
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

      {/* Modal de pago */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-light rounded-xl border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text">
                  {step === 'personal' ? 'Información de envío' : 'Método de pago'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-text-secondary hover:text-text"
                >
                  ✕
                </button>
              </div>

              {step === 'personal' ? (
                <div className="space-y-4">
                  {/* Nombre completo */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Nombre completo *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  {/* Dirección de envío */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Dirección de envío *</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Calle, número, ciudad, país"
                    />
                  </div>
                  {/* Municipio y País en dos columnas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Municipio *</label>
                      <input
                        type="text"
                        value={municipality}
                        onChange={(e) => setMunicipality(e.target.value)}
                        className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Ej: Medellín"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">País *</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Ej: Colombia"
                      />
                    </div>
                  </div>
                  {/* Código postal */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Código postal *</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ej: 050001"
                    />
                  </div>
                  {/* Correo electrónico */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Correo electrónico * (para tu factura)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="tu@email.com"
                    />
                  </div>
                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Teléfono *</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="3001234567"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Número de tarjeta */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Número de tarjeta *</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={19}
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      {cardNumber ? `Tipo: ${cardType(cardNumber)}` : 'Ingresa tu número'}
                    </p>
                  </div>
                  {/* Nombre en tarjeta y vencimiento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Nombre en tarjeta *</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Vencimiento *</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) {
                            setExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
                          } else {
                            setExpiry(val);
                          }
                        }}
                        placeholder="MM/AA"
                        className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        maxLength={5}
                      />
                    </div>
                  </div>
                  {/* CVV */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">CVV *</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      className="w-full px-3 py-2 bg-dark border border-border rounded text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={4}
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                {step === 'card' && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 text-text hover:text-primary"
                  >
                    ← Atrás
                  </button>
                )}
                <button
                  onClick={step === 'personal' ? handleNext : handleCheckout}
                  disabled={checkoutLoading}
                  className="ml-auto px-6 py-2 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                  {checkoutLoading ? 'Procesando...' : step === 'personal' ? 'Continuar' : 'Confirmar pago'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;