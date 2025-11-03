// frontend/src/pages/CarDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) {
        navigate("/cars");
        return;
      }
      try {
        const response = await api.get(`/cars/${id}`);
        setCar(response.data);
      } catch (error) {
        console.error("Error fetching car:", error);
        navigate("/cars");
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
          <h2 className="text-xl text-red-400 font-medium mb-4">
            Vehículo no encontrado
          </h2>
          <button
            onClick={() => navigate("/cars")}
            className="px-6 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            🚗 Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  // === Velocímetro tipo gráfico semicircular ===
  const Speedometer = ({ value }: { value: number }) => {
    const maxSpeed = 300;
    const percentage = Math.min(value / maxSpeed, 1);
    const rotation = -90 + percentage * 180; // semicircular
    const arcColor =
      value < 120 ? "#22c55e" : value < 220 ? "#facc15" : "#ef4444"; // verde, amarillo, rojo según velocidad

    return (
      <div className="relative flex flex-col items-center justify-center w-[300px] h-[180px]">
        <svg width="300" height="150" viewBox="0 0 300 150">
          {/* Fondo semicircular */}
          <path
            d="M20 130 A130 130 0 0 1 280 130"
            fill="none"
            stroke="#333"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Progreso semicircular */}
          <path
            d="M20 130 A130 130 0 0 1 280 130"
            fill="none"
            stroke={arcColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 408} 408`}
            style={{
              transition: "stroke-dasharray 1.5s ease-out, stroke 0.5s",
            }}
          />

          {/* Aguja */}
          <g
            transform={`rotate(${rotation}, 150, 130)`}
            style={{ transition: "transform 1.5s ease-out" }}
          >
            <line
              x1="150"
              y1="130"
              x2="150"
              y2="30"
              stroke="#00bfff"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="150" cy="130" r="6" fill="#00bfff" />
          </g>

          {/* Escala numérica */}
          {[0, 50, 100, 150, 200, 250, 300].map((speed, i) => {
            const angle = (-90 + (speed / maxSpeed) * 180) * (Math.PI / 180);
            const x = 150 + Math.cos(angle) * 110;
            const y = 130 + Math.sin(angle) * 110;
            return (
              <text
                key={i}
                x={x}
                y={y}
                fill="#ccc"
                fontSize="12"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {speed}
              </text>
            );
          })}
        </svg>
        <div className="text-center mt-4">
          <p className="text-3xl font-bold text-white">{Math.round(value)} km/h</p>
          <p className="text-gray-400 text-sm">Velocidad máxima</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark text-text">
      {/* Header */}
      <header className="bg-dark-light border-b border-border px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/cars")}
          className="flex items-center gap-2 text-primary hover:text-primary/80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver al Catálogo
        </button>
        <h1 className="text-xl font-light text-text">Detalles del Vehículo</h1>
      </header>

      {/* Imagen principal */}
      <section
        className="relative h-[380px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${
            car.image_url?.[0] ||
            "https://via.placeholder.com/1200x600?text=Auto+No+Disponible"
          })`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 flex items-end p-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {car.brand} {car.model}
            </h1>
            <p className="text-lg text-gray-300 mt-2">{car.year}</p>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <main className="container mx-auto px-6 py-10">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Descripción</h2>
          <p className="text-text-secondary leading-relaxed text-lg">
            {car.description}
          </p>
        </section>

        {/* Especificaciones */}
        <section className="bg-dark-light rounded-2xl border border-border p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Especificaciones Técnicas</h2>

          <div className="flex flex-col items-center mb-10">
            <Speedometer value={car.top_speed || 0} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            {[
              { label: "Potencia", value: `${car.horsepower} HP` },
              { label: "Aceleración 0-100 km/h", value: car.acceleration },
              { label: "Motor", value: car.engine },
              { label: "Transmisión", value: car.transmission },
              { label: "Tracción", value: car.drive_train },
              { label: "Peso", value: car.weight },
              { label: "Combustible", value: car.fuel_type },
              { label: "Año", value: car.production_years },
              {
                label: "Precio Estimado",
                value: `$${car.price?.toLocaleString()}`,
              },
            ].map((spec, i) => (
              <div
                key={i}
                className="bg-dark p-4 rounded-xl border border-border hover:border-primary/60 transition"
              >
                <p className="text-gray-400 text-sm">{spec.label}</p>
                <p className="text-white font-semibold mt-1">{spec.value}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
          <button
            onClick={() => navigate("/compare")}
            className="py-3 px-8 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Comparar este Auto
          </button>
          <button
            onClick={() => navigate("/cars")}
            className="py-3 px-8 bg-transparent border border-primary text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
          >
            Ver Otros Autos
          </button>
        </div>
      </main>
    </div>
  );
};

export default CarDetail;
