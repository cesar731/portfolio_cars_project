// frontend/src/pages/AccessoriesShop.tsx

import { useState, useEffect } from 'react';
import { Accessory } from '../types';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const AccessoriesShop = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [filteredAccessories, setFilteredAccessories] = useState<Accessory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Rines', 'Escapes', 'Amortiguadores', 'Luces', 'Interior'];

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await api.get<Accessory[]>('/accessories');
        setAccessories(response.data);     
        setFilteredAccessories(response.data); 
      } catch (error) {
        console.error('Error fetching accessories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  useEffect(() => {
    let result = accessories;

    if (searchTerm) {
      result = result.filter(
        (acc) =>
          acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          acc.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((acc) => acc.category === selectedCategory);
    }

    setFilteredAccessories(result);
  }, [searchTerm, selectedCategory, accessories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando accesorios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[350px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557598853-d41249562155?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-2">Tienda de Accesorios</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl text-center">
            Encuentra los accesorios perfectos para tu vehículo: rines, escapes, amortiguadores y más.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text mb-2">Buscar por nombre o descripción</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej: Rines deportivos..."
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-text mb-2">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas las categorías' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAccessories.length > 0 ? (
            filteredAccessories.map((acc) => (
              <div key={acc.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl shadow-card bg-dark-light border border-border h-full flex flex-col">
                  <img
                    src={acc.image_url || 'https://via.placeholder.com/300x200?text=Accesorio'}
                    alt={acc.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold text-text text-sm">{acc.name}</h3>
                    <p className="text-text-secondary text-xs mt-1">{acc.category}</p>
                    <p className="text-text-secondary text-xs mt-2 line-clamp-2">{acc.description}</p>
                    <span className="mt-auto text-primary font-bold">${acc.price.toLocaleString()}</span>
                  </div>
                  <div className="p-4 border-t border-border">
                    <Link
                      to={`/accessories/${acc.id}`}
                      className="block w-full py-2 px-4 text-center text-sm bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors font-medium"
                    >
                      Ver Detalles →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-secondary">No hay accesorios disponibles.</p>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-dark-light border-t border-border px-6 py-4 mt-16">
        <p className="text-text-secondary text-center text-sm">
          © 2025 Portfolio de Autos - Proyecto ADSO
        </p>
      </footer>
    </div>
  );
};

export default AccessoriesShop;