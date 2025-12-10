// frontend/src/pages/AccessoriesShop.tsx
import { useState, useEffect } from 'react';
import { Accessory } from '../types';
import api from '../services/api';
import { Link } from 'react-router-dom';

const AccessoriesShop = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [filteredAccessories, setFilteredAccessories] = useState<Accessory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, accessories]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAccessories = filteredAccessories.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredAccessories.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-dark text-text">

      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('../public/images/seccion_accesory_car3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-4">Tienda de Accesorios</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Encuentra los accesorios perfectos para tu vehículo.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">

        {/* BUSCADOR */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar accesorio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-dark-light border border-border text-text"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-dark-light border border-border text-text"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Todas las Categorías' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentAccessories.length > 0 ? (
            currentAccessories.map((acc) => {
              const firstImage = acc.images?.length
                ? acc.images[0].image_url
                : acc.image_url || 'https://via.placeholder.com/300x200?text=Accesorio';

              return (
                <div key={acc.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl shadow-card bg-dark-light border border-border h-full flex flex-col">
                    <img
                      src={firstImage}
                      alt={acc.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-bold text-text text-sm">{acc.name}</h3>
                      <p className="text-text-secondary text-xs mt-1">{acc.category}</p>
                      <p className="text-text-secondary text-xs mt-2 line-clamp-2">
                        {acc.description}
                      </p>
                      <span className="mt-auto text-primary font-bold">
                        ${acc.price.toLocaleString()}
                      </span>
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
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-secondary">No hay accesorios disponibles.</p>
            </div>
          )}
        </div>

        {/* PAGINACIÓN (la que tenías antes) */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === num
                    ? 'bg-primary text-white border-primary'
                    : 'bg-dark-light text-text border-border hover:bg-dark'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AccessoriesShop;
