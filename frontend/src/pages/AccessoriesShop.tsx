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
  const itemsPerPage = 9; // Mostrar 9 accesorios por página

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
    setCurrentPage(1); // Reiniciar a la primera página al filtrar
  }, [searchTerm, selectedCategory, accessories]);

  // 🔹 Al cambiar de página, hacer scroll al inicio
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

  // Calcular los accesorios que se mostrarán según la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAccessories = filteredAccessories.slice(startIndex, startIndex + itemsPerPage);

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredAccessories.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-dark text-text">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('../public/images/seccion_accesory_car3.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-4">
            Tienda de Accesorios
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Encuentra los accesorios perfectos para tu vehículo: rines, escapes, amortiguadores y más.
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text mb-2">
              Buscar por nombre o descripción
            </label>
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

        {/* RESULTADOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentAccessories.length > 0 ? (
            currentAccessories.map((acc) => (
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-secondary">No hay accesorios disponibles.</p>
            </div>
          )}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-dark-light border border-border rounded-lg text-text hover:bg-primary/10 disabled:opacity-50"
            >
              ← Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === page
                    ? 'bg-primary text-white border-primary'
                    : 'bg-dark-light text-text border-border hover:bg-primary/10'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-dark-light border border-border rounded-lg text-text hover:bg-primary/10 disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessoriesShop;
