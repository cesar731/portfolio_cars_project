// frontend/src/pages/CarsCatalog.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CarsCatalog = () => {
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para los filtros
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    fuelType: '',
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const params = {
          brand: filters.brand || undefined,
          model: filters.model || undefined,
          min_year: filters.minYear || undefined,
          max_year: filters.maxYear || undefined,
          min_price: filters.minPrice || undefined,
          max_price: filters.maxPrice || undefined,
          fuel_type: filters.fuelType || undefined,
        };
        const response = await api.get('/cars', { params });
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [filters]);

  const handleAddToCompare = (id: number) => {
    if (selectedForComparison.length >= 3) return;
    if (!selectedForComparison.includes(id)) {
      const newSelection = [...selectedForComparison, id];
      setSelectedForComparison(newSelection);
      localStorage.setItem('selectedCars', JSON.stringify(newSelection));
    }
  };

  const handleRemoveFromCompare = (id: number) => {
    const newSelection = selectedForComparison.filter(item => item !== id);
    setSelectedForComparison(newSelection);
    localStorage.setItem('selectedCars', JSON.stringify(newSelection));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      model: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando autos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[350px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549073953-5d821c29b3e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-2">Catálogo de Autos</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl text-center">
            Explora vehículos de élite: desde clásicos legendarios hasta hypercars eléctricos del futuro.
          </p>
        </div>
      </section>

      {/* Filtros Avanzados */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-dark-light p-6 rounded-xl shadow-card border border-border mb-8">
          <h2 className="text-2xl font-bold text-text mb-4">Filtros Avanzados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-text-secondary mb-1 text-sm">Marca</label>
              <input
                type="text"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                placeholder="Ej: Ferrari"
                className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-1 text-sm">Modelo</label>
              <input
                type="text"
                name="model"
                value={filters.model}
                onChange={handleFilterChange}
                placeholder="Ej: F40"
                className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-1 text-sm">Año Mín.</label>
              <input
                type="number"
                name="minYear"
                value={filters.minYear}
                onChange={handleFilterChange}
                placeholder="2000"
                className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-1 text-sm">Año Máx.</label>
              <input
                type="number"
                name="maxYear"
                value={filters.maxYear}
                onChange={handleFilterChange}
                placeholder="2025"
                className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-1 text-sm">Precio Mín. ($)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="50000"
                className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-1 text-sm">Precio Máx. ($)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="500000"
                className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-1 text-sm">Combustible</label>
              <input
                type="text"
                name="fuelType"
                value={filters.fuelType}
                onChange={handleFilterChange}
                placeholder="Gasolina"
                className="w-full px-3 py-2 bg-dark border border-border rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full py-2 px-4 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Botón Comparar (opcional en móvil) */}
        <div className="md:hidden mb-6">
          <Link
            to="/compare"
            className="inline-block px-6 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            📊 Comparar Autos ({selectedForComparison.length})
          </Link>
        </div>

        {/* Grid de Autos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl shadow-card bg-dark-light border border-border h-full flex flex-col">
                  <img 
                    src={car.image_url?.[0] || 'https://via.placeholder.com/300x200?text=Auto+No+Disponible'} 
                    alt={`${car.brand} ${car.model}`} 
                    className="w-full h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-4 text-center bg-dark-light border-t border-border">
                    <h3 className="font-bold text-text text-sm">{car.brand} {car.model}</h3>
                    <p className="text-text-secondary text-xs mt-1">{car.year}</p>
                  </div>
                  <div className="p-4 bg-dark-light border-t border-border flex flex-col gap-2">
                    <Link
                      to={`/cars/${car.id}`}
                      className="block w-full py-2 px-4 text-center text-sm bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors font-medium"
                    >
                      Ver Detalles →
                    </Link>
                    <button
                      onClick={
                        selectedForComparison.includes(car.id)
                          ? () => handleRemoveFromCompare(car.id)
                          : () => handleAddToCompare(car.id)
                      }
                      disabled={selectedForComparison.length >= 3}
                      className={`py-2 px-4 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors ${
                        selectedForComparison.includes(car.id)
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
                      }`}
                      title={selectedForComparison.length >= 3 ? 'Máximo 3 autos' : 'Agregar a comparación'}
                    >
                      {selectedForComparison.includes(car.id) ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Eliminar
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Comparar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-secondary">No hay autos disponibles con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>

      {/* Notificación flotante para móviles */}
      {selectedForComparison.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-3">
          <span className="text-sm font-medium">
            {selectedForComparison.length} auto(s) seleccionado(s) para comparar
          </span>
          <Link
            to="/compare"
            className="bg-primary text-text px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Comparar
          </Link>
        </div>
      )}
    </div>
  );
}; 

export default CarsCatalog;