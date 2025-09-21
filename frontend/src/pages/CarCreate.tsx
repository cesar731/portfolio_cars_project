// frontend/src/pages/CarCreate.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  api  from '../services/api';
import { Car } from '../types';

const CarCreate = () => {
  const navigate = useNavigate();
  const [car, setCar] = useState<Partial<Car>>({
    brand: '',
    model: '',
    year: 2024,
    price: 0,
    description: '',
    image_url: [''],
    fuel_type: '',
    mileage: 0,
    color: '',
    engine: '',
    horsepower: 0,
    top_speed: 0,
    transmission: '',
    drive_train: '',
    weight: '',
    production_years: '',
    is_published: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/cars', car);
      navigate('/cars');
    } catch (error) {
      alert('Error al crear el auto. Verifica los datos.');
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text p-6">
      <h1 className="text-4xl font-light text-white mb-8">Crear Nuevo Auto</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-dark-light p-8 rounded-xl shadow-card border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-text-secondary mb-1">Marca</label>
            <input
              type="text"
              value={car.brand || ''}
              onChange={(e) => setCar({...car, brand: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Modelo</label>
            <input
              type="text"
              value={car.model || ''}
              onChange={(e) => setCar({...car, model: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Año</label>
            <input
              type="number"
              value={car.year || ''}
              onChange={(e) => setCar({...car, year: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Precio ($)</label>
            <input
              type="number"
              value={car.price || ''}
              onChange={(e) => setCar({...car, price: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Tipo de Combustible</label>
            <input
              type="text"
              value={car.fuel_type || ''}
              onChange={(e) => setCar({...car, fuel_type: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Kilometraje</label>
            <input
              type="number"
              value={car.mileage || ''}
              onChange={(e) => setCar({...car, mileage: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Color</label>
            <input
              type="text"
              value={car.color || ''}
              onChange={(e) => setCar({...car, color: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Potencia (HP)</label>
            <input
              type="number"
              value={car.horsepower || ''}
              onChange={(e) => setCar({...car, horsepower: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Velocidad Máxima (km/h)</label>
            <input
              type="number"
              value={car.top_speed || ''}
              onChange={(e) => setCar({...car, top_speed: parseInt(e.target.value)})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Transmisión</label>
            <input
              type="text"
              value={car.transmission || ''}
              onChange={(e) => setCar({...car, transmission: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Tracción</label>
            <input
              type="text"
              value={car.drive_train || ''}
              onChange={(e) => setCar({...car, drive_train: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Peso</label>
            <input
              type="text"
              value={car.weight || ''}
              onChange={(e) => setCar({...car, weight: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Años de Producción</label>
            <input
              type="text"
              value={car.production_years || ''}
              onChange={(e) => setCar({...car, production_years: e.target.value})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-text-secondary mb-1">Descripción</label>
            <textarea
              value={car.description || ''}
              onChange={(e) => setCar({...car, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-text-secondary mb-1">URL de Imagen (URL única)</label>
            <input
              type="url"
              value={car.image_url?.[0] || ''}
              onChange={(e) => setCar({...car, image_url: [e.target.value]})}
              className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/car.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={car.is_published || false}
                onChange={(e) => setCar({...car, is_published: e.target.checked})}
                className="mr-2"
              />
              Publicado
            </label>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            className="px-8 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Crear Auto
          </button>
          <button
            type="button"
            onClick={() => navigate('/cars')}
            className="px-8 py-3 bg-dark border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarCreate;