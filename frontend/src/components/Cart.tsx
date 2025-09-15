 
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface CartItem {
  accessory: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
}

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  if (cartItems.length === 0) {
    return <p className="text-center py-8">Tu carrito está vacío.</p>;
  }

  const total = cartItems.reduce((sum, item) => sum + item.accessory.price * item.quantity, 0);

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Carrito de Compras ({cartItems.length} artículos)</h2>
      <ul className="space-y-3 mb-6">
        {cartItems.map(item => (
          <li key={item.accessory.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <strong>{item.accessory.name}</strong> x{item.quantity}
              <br />
              <span className="text-sm text-gray-600">${item.accessory.price.toLocaleString()}</span>
            </div>
            <button
              onClick={() => removeFromCart(item.accessory.id)}
              className="btn-danger text-sm"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="font-bold">Total: ${total.toLocaleString()}</span>
        <div className="flex space-x-2">
          <button onClick={clearCart} className="btn-secondary text-sm">Vaciar</button>
          <Link to="/accessories" className="btn-primary text-sm">Continuar Comprando</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;