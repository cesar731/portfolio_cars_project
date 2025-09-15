import React from 'react';
import { Link } from 'react-router-dom';

interface Accessory {
  id: number;
  name: string;
  price: number;
  category?: string;
  stock: number;
  image_url?: string;
}

const AccessoryCard: React.FC<{ accessory: Accessory }> = ({ accessory }) => {
  return (
    <div className="accessory-card">
      <img
        src={accessory.image_url || '/default-accessory.jpg'}
        alt={accessory.name}
        className="accessory-img"
      />
      <div className="accessory-info">
        <h3 className="accessory-title">{accessory.name}</h3>
        <p className="accessory-price">${accessory.price.toLocaleString()}</p>
        <p className="accessory-category">{accessory.category || '-'}</p>
        <p className={`accessory-stock ${accessory.stock > 0 ? 'in-stock' : 'out-stock'}`}>
          {accessory.stock > 0 ? 'En stock' : 'Agotado'}
        </p>
        <Link to={`/accessories/${accessory.id}`} className="btn btn-primary">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

export default AccessoryCard;
