// frontend/src/pages/AccessoryDetail.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import  api  from '../services/api';

const AccessoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accessory, setAccessory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessory = async () => {
      if (!id) {
        navigate('/accessories');
        return;
      }
      try {
        const response = await api.get(`/api/accessories/${id}`);
        setAccessory(response.data);
      } catch (error) {
        console.error('Error fetching accessory:', error);
        navigate('/accessories');
      } finally {
        setLoading(false);
      }
    };

    fetchAccessory();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Cargando accesorio...</p>
        </div>
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="min-h-screen bg-dark text-text flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-400 font-medium mb-4">Accesorio no encontrado</h2>
          <button
            onClick={() => navigate('/accessories')}
            className="px-6 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            🛒 Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text">
      {/* Header */}
      <header className="bg-dark-light border-b border-border px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/accessories')}
          className="flex items-center gap-2 text-primary hover:text-primary/80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Accesorios
        </button>
        <h1 className="text-xl font-light text-text">Detalles del Accesorio</h1>
      </header>

      {/* Hero Section */}
      <section className="relative h-[400px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${accessory.image_url || 'https://via.placeholder.com/1200x600?text=Accesorio+No+Disponible'})` }}>
        <div className="absolute inset-0 bg-black/60 flex items-end p-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">{accessory.name}</h1>
            <p className="text-xl text-gray-200 mt-2">{accessory.category}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-4">Descripción</h2>
          <p className="text-text-secondary text-lg leading-relaxed">{accessory.description}</p>
        </div>

        {/* Especificaciones Técnicas */}
        <div className="bg-dark-light rounded-2xl shadow-card border border-border p-8 mb-12">
          <h2 className="text-2xl font-bold text-text mb-6">Especificaciones Técnicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Precio</span>
              <span className="text-white font-bold text-lg">${accessory.price.toLocaleString()}</span>
            </div>
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Categoría</span>
              <span className="text-white font-bold text-lg">{accessory.category}</span>
            </div>
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Stock Disponible</span>
              <span className="text-white font-bold text-lg">{accessory.stock} unidades</span>
            </div>
            <div className="border-b border-border/20 pb-4">
              <span className="text-text-secondary text-sm block">Estado</span>
              <span className={`font-bold text-lg ${accessory.is_published ? 'text-green-400' : 'text-red-400'}`}>
                {accessory.is_published ? 'Disponible' : 'No disponible'}
              </span>
            </div>
          </div>
        </div>

        {/* Acción: Agregar al carrito */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={() => navigate('/cart')}
            className="py-3 px-8 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-7H5.4M12 16v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m......" />
            </svg>
            Agregar al Carrito
          </button>

          <button
            onClick={() => navigate('/accessories')}
            className="py-3 px-8 bg-dark border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18z" />
            </svg>
            Ver Otros Accesorios
          </button>
        </div>

        {/* Imagen Adicional */}
        {accessory.image_url && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-text mb-4">Imagen del Accesorio</h3>
            <img 
              src={accessory.image_url} 
              alt={accessory.name} 
              className="w-full h-80 object-cover rounded-xl shadow-card"
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-dark-light border-t border-border px-6 py-4 mt-16">
        <p className="text-text-secondary text-center text-sm">
          © 2025 Portfolio de Autos - Proyecto ADSO
        </p>
      </footer>
    </div>
  );
};

export default AccessoryDetail;