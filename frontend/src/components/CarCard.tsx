 
import React from 'react';
import { Link } from 'react-router-dom';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  description?: string;
  image_url?: string[];
}

const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  const firstImage = car.image_url?.[0] || '/default-car.jpg';

  return (
    <div className="card hover:shadow-xl transition-shadow">
      <img src={firstImage} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover rounded-md mb-3" />
      <h3 className="font-bold text-lg">{car.brand} {car.model} ({car.year})</h3>
      <p className="text-gray-600 mb-2">${car.price.toLocaleString()}</p>
      <p className="text-sm text-gray-500 line-clamp-2">{car.description}</p>
      <Link to={`/cars/${car.id}`} className="btn-primary mt-3 block text-center">
        Ver Detalles
      </Link>
    </div>
  );
};

export default CarCard;