// frontend/src/pages/Checkout.tsx
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para continuar.');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Tu carrito está vacío.');
      return;
    }

    const userId = Number(user.id);
    if (isNaN(userId)) {
      toast.error('Error: ID de usuario inválido.');
      return;
    }

    try {
      const items = cartItems.map(item => ({
        accessory_id: Number(item.accessory.id),
        quantity: Number(item.quantity)
      })).filter(item => !isNaN(item.accessory_id) && item.quantity > 0);

      if (items.length === 0) {
        toast.error('No hay productos válidos en el carrito.');
        return;
      }

      const response = await api.post('/purchases/checkout', {
        user_id: userId,
        items
      });

      // Descargar PDF inmediatamente
      const purchaseId = response.data.id;
      const pdfUrl = `/api/purchases/${purchaseId}/invoice`;
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `factura_${response.data.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Compra realizada. Factura: ${response.data.invoice_number}`);
      clearCart();
      navigate('/profile');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      let message = 'Error al procesar la compra.';
      if (typeof detail === 'string') {
        message = detail;
      } else if (Array.isArray(detail)) {
        message = detail.map((d: any) => d.msg || d).join(', ');
      }
      toast.error(message);
      console.error('Error en checkout:', err.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-dark-light p-8 rounded-xl shadow-card border border-border">
        <h1 className="text-3xl font-light text-white mb-6 text-center">Confirmar Compra</h1>
        <p className="text-text-secondary text-center mb-6">
          Revisa los productos y haz clic en "Pagar" para finalizar tu compra.
        </p>
        <div className="space-y-3 mb-8">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.accessory.name}</span>
              <span>{item.quantity} × ${item.accessory.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleCheckout}
          className="w-full mt-4 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition"
        >
          Pagar Ahora
        </button>
        <button
          onClick={() => navigate('/cart')}
          className="w-full mt-3 py-2 text-primary hover:text-primary/80 text-sm"
        >
          ← Volver al Carrito
        </button>
      </div>
    </div>
  );
};

export default Checkout;