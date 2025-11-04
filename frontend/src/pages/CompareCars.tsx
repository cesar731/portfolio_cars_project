// frontend/src/pages/CompareCars.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Car } from '../types';
import { useAuth } from '../context/AuthContext';

const CompareCars = () => {
  const { comparedCars, clearComparison, removeFromComparison } = useAuth();
  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSelectedCars = async () => {
      if (comparedCars.length === 0) {
        setSelectedCars([]);
        setLoading(false);
        return;
      }

      try {
        const cars: Car[] = [];
        for (const id of comparedCars) {
          try {
            const response = await api.get<Car>(`/cars/${id}`);
            cars.push(response.data);
          } catch (error) {
            console.warn(`Auto con ID ${id} no encontrado.`);
          }
        }
        setSelectedCars(cars);
      } catch (error) {
        console.error('Error loading compared cars:', error);
        setSelectedCars([]);
      } finally {
        setLoading(false);
      }
    };

    loadSelectedCars();
  }, [comparedCars]);

  const removeCar = (id: number) => removeFromComparison(id);
  const clearAll = () => clearComparison();

  const specs = [
    { label: 'Marca', key: 'brand', render: (car: Car) => car.brand },
    { label: 'Modelo', key: 'model', render: (car: Car) => car.model },
    { label: 'Año', key: 'year', render: (car: Car) => car.year },
    { label: 'Precio', key: 'price', render: (car: Car) => `$${car.price.toLocaleString()}` },
    { label: 'Combustible', key: 'fuel_type', render: (car: Car) => car.fuel_type || '-' },
    { label: 'Kilometraje', key: 'mileage', render: (car: Car) => car.mileage ? `${car.mileage.toLocaleString()} km` : '-' },
    { label: 'Color', key: 'color', render: (car: Car) => car.color || '-' },
    { label: 'Motor', key: 'engine', render: (car: Car) => car.engine || '-' },
    { label: 'Potencia (HP)', key: 'horsepower', render: (car: Car) => car.horsepower ? `${car.horsepower} HP` : '-' },
    { label: 'Velocidad Máxima', key: 'top_speed', render: (car: Car) => car.top_speed ? `${car.top_speed} km/h` : '-' },
    { label: 'Transmisión', key: 'transmission', render: (car: Car) => car.transmission || '-' },
    { label: 'Tracción', key: 'drive_train', render: (car: Car) => car.drive_train || '-' },
    { label: 'Peso', key: 'weight', render: (car: Car) => car.weight || '-' },
    { label: 'Años de Producción', key: 'production_years', render: (car: Car) => car.production_years || '-' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando comparación...</p>
        </div>
      </div>
    );
  }

  // ✅ Vista sin autos seleccionados — con imagen de fondo en toda la sección
  if (selectedCars.length === 0) {
    return (
      <div
        className="min-h-screen bg-dark text-white relative flex flex-col items-center justify-center text-center px-6"
        style={{
          backgroundImage:
            "url('../public/images/seccion_catalog_car2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" /> {/* superposición oscura */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl font-light mb-6">Comparar Autos</h1>
          <p className="text-xl text-gray-200 mb-6">
            Selecciona hasta 3 vehículos en el catálogo para comparar sus especificaciones técnicas.
          </p>
          <p className="text-lg text-gray-300 mb-10">
            Visita el catálogo de autos, haz clic en el botón “Comparar” en cualquier tarjeta y añade hasta tres vehículos para compararlos lado a lado.
          </p>
          <Link
            to="/cars"
            className="inline-block px-8 py-4 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors text-lg"
          >
            🚗 Ir al Catálogo de Autos
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Vista cuando sí hay autos seleccionados
  return (
    <div className="min-h-screen bg-dark text-text">
      <header className="bg-dark-light border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-light text-text">📊 Comparar Autos</h1>
        <div className="flex items-center gap-4">
          <span className="text-text-secondary text-sm">
            {selectedCars.length} auto(s) seleccionado(s)
          </span>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </header>

      <section className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {selectedCars.map(car => (
            <div
              key={car.id}
              className="bg-dark-light rounded-xl p-6 border border-border flex flex-col items-center text-center"
            >
              <img
                src={car.image_url?.[0] || 'https://via.placeholder.com/120x80?text=Auto'}
                alt={`${car.brand} ${car.model}`}
                className="w-24 h-16 object-cover rounded-lg mb-4 shadow-md"
              />
              <h3 className="text-xl font-bold text-text">{car.model}</h3>
              <p className="text-text-secondary text-sm">{car.brand} • {car.year}</p>
              <button
                onClick={() => removeCar(car.id)}
                className="mt-4 text-red-400 hover:text-red-300 text-sm font-medium underline flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Quitar
              </button>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-dark-light shadow-card">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/20">
                <th className="py-4 px-6 font-medium text-text min-w-[200px]">Especificación</th>
                {selectedCars.map(car => (
                  <th key={car.id} className="py-4 px-6 font-medium text-text text-center min-w-[180px]">
                    <div className="font-bold text-sm">{car.brand}</div>
                    <div className="text-text-secondary text-xs">{car.model}</div>
                    <div className="text-text-secondary text-xs">{car.year}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map(spec => (
                <tr key={spec.label} className="border-b border-border/10 hover:bg-dark/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-text min-w-[200px]">{spec.label}</td>
                  {selectedCars.map(car => (
                    <td key={`${car.id}-${spec.key}`} className="py-4 px-6 text-center text-text min-w-[180px]">
                      <span className="font-medium">{spec.render(car)}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/cars"
            className="px-8 py-4 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors text-lg"
          >
            🚗 Volver al Catálogo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CompareCars;
