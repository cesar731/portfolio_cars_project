import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Accessory } from '../types';

const AccessoryCard: React.FC<{ accessory: Accessory }> = ({ accessory }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!user) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }
    addToCart(accessory.id);
  };

  return (
    <div className="accessory-card bg-dark-light rounded-xl shadow-card border border-border p-6 hover:shadow-xl transition-shadow">
      <img
        src={accessory.image_url || 'https://via.placeholder.com/300x200?text=Accesorio'}
        alt={accessory.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <div className="accessory-info">
        <h3 className="accessory-title text-xl font-bold text-text mb-2">{accessory.name}</h3>
        <p className="accessory-price text-primary font-bold text-lg">${accessory.price.toLocaleString()}</p>
        <p className="accessory-category text-text-secondary text-sm mb-4">{accessory.category || '-'}</p>
        <p className={`accessory-stock text-sm mb-4 ${
          accessory.stock > 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {accessory.stock > 0 ? 'En stock' : 'Agotado'}
        </p>
        <div className="flex gap-2">
          <Link to={`/accessories/${accessory.id}`} className="flex-1 py-2 px-4 bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors text-center text-sm font-medium">
            Ver Detalles
          </Link>
          {accessory.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="flex-1 py-2 px-4 bg-green-600 text-text rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
            >
              Agregar al Carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessoryCard;