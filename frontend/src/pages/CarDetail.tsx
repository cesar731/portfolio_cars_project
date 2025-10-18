// frontend/src/pages/CarDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) {
        navigate('/cars');
        return;
      }
      try {
        const response = await api.get(`/cars/${id}`);
        setCar(response.data);
      } catch (error) {
        console.error('Error fetching car:', error);
        navigate('/cars');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando detalles del vehículo...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-400 font-medium mb-4">Vehículo no encontrado</h2>
          <button
            onClick={() => navigate('/cars')}
            className="px-6 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            🚗 Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  // Velocímetro interactivo
  const Speedometer = ({ value }: { value: number }) => {
    const [animatedSpeed, setAnimatedSpeed] = useState(0);
    const maxSpeed = 300;
    const radius = 90;
    const strokeWidth = 10;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (animatedSpeed / maxSpeed) * circumference;

    useEffect(() => {
      const duration = 1500;
      const frames = 60;
      const increment = value / frames;
      let current = 0;
      const intervalId = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedSpeed(value);
          clearInterval(intervalId);
        } else {
          setAnimatedSpeed(current);
        }
      }, duration / frames);
      return () => clearInterval(intervalId);
    }, [value]);

    return (
      <div className="relative flex flex-col items-center">
        <svg height={200} width={200} className="transform -rotate-90">
          <circle
            cx={100}
            cy={100}
            r={normalizedRadius}
            fill="#1a1a1a"
            stroke="#333"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={100}
            cy={100}
            r={normalizedRadius}
            stroke="#0066cc"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold">
          {Math.round(animatedSpeed)} km/h
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark text-text">
      {/* Header */}
      <header className="bg-dark-light border-b border-border px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/cars')}
          className="flex items-center gap-2 text-primary hover:text-primary/80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Catálogo
        </button>
        <h1 className="text-xl font-light text-text">Detalles del Vehículo</h1>
      </header>

      {/* Hero Section */}
      <section 
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${
            car.image_url && car.image_url.length > 0
              ? car.image_url[0]
              : 'https://via.placeholder.com/1200x600?text=Auto+No+Disponible'
          })`
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex items-end p-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">{car.brand} {car.model}</h1>
            <p className="text-xl text-gray-200 mt-2">{car.year}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Descripción */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-4">Descripción</h2>
          <p className="text-text-secondary text-lg leading-relaxed">{car.description}</p>
        </div>

        {/* Especificaciones Técnicas */}
        <div className="bg-dark-light rounded-2xl shadow-card border border-border p-8 mb-12">
          <h2 className="text-2xl font-bold text-text mb-6">Especificaciones Técnicas</h2>

          {/* Velocímetro */}
          <div className="flex flex-col items-center mb-8">
            <Speedometer value={car.top_speed || 0} />
            <span className="text-text-secondary mt-2">Velocidad máxima</span>
          </div>

          {/* Lista de especificaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Potencia</span>
              <span className="text-white font-bold">{car.horsepower} HP</span>
            </div>
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Aceleración 0-100 km/h</span>
              <span className="text-white font-bold">{car.acceleration}</span>
            </div>
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Motor</span>
              <span className="text-white font-bold">{car.engine}</span>
            </div>
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Transmisión</span>
              <span className="text-white font-bold">{car.transmission}</span>
            </div>
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Tracción</span>
              <span className="text-white font-bold">{car.drive_train}</span>
            </div>
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Peso</span>
              <span className="text-white font-bold">{car.weight}</span>
            </div>
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Combustible</span>
              <span className="text-white font-bold">{car.fuel_type}</span>
            </div>
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Año de Producción</span>
              <span className="text-white font-bold">{car.production_years}</span>
            </div>
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Precio Estimado</span>
              <span className="text-primary font-bold">${car.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={() => navigate('/compare')}
            className="py-3 px-8 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            Comparar este Auto
          </button>
          <button
            onClick={() => navigate('/cars')}
            className="py-3 px-8 bg-dark border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
          >
            Ver Otros Autos
          </button>
        </div>
      </main>
    </div>
  );
};

export default CarDetail;