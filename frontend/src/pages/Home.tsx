
import { Link } from 'react-router-dom';

const Home = () => {
  
  const quienesSomosImage = '/images/quienes somos car.jpg';

  return (
    <div className="min-h-screen bg-dark text-text">
    
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-light text-white leading-none tracking-tight mb-6">
            Viaggio Velogge
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Descubre la excelencia automotriz. Catálogo exclusivo, asesoría personalizada y experiencia premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/cars" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-dark transition-all duration-300 font-medium text-lg"
            >
              Ver Catálogo
            </Link>
            <Link 
              to="/consultation" 
              className="px-8 py-4 bg-white text-dark hover:bg-transparent hover:text-white hover:border-white border-2 border-white transition-all duration-300 font-medium text-lg"
            >
              Solicitar Asesoría
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN "QUIÉNES SOMOS" */}
      <section className="py-20 bg-dark-light border-t border-border">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div className="pr-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Viaggio Velogge</h1>
              <p className="text-primary font-light mb-8">
                Donde el lujo se encuentra con la carretera.
              </p>
              <div className="space-y-4 mb-8">
                <p className="text-text-secondary leading-relaxed">
                  <strong>Viaggio Velogge</strong> nace de la pasión por lo extraordinario. No somos solo un catálogo de autos: somos un puente entre el lujo, la ingeniería y la emoción de conducir.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Cada vehículo en nuestra colección ha sido seleccionado con rigor, no solo por su diseño o potencia, sino por la historia que representa.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Ya seas coleccionista, entusiasta o futuro propietario de tu primer superdeportivo, aquí encontrarás más que un auto: encontrarás una experiencia.
                </p>
              </div>
            </div>

            {/* Imagen optimizada */}
            <div className="hidden lg:block w-full h-full relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="absolute inset-0 bg-black/60"></div>
              <img
                src={quienesSomosImage}
                alt="Viaggio Velogge - Colección de autos de lujo"
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;