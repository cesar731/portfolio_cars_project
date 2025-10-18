// frontend/src/pages/Home.tsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-dark text-text">
      
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-no-repeat opacity-90"></div>
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

      {/* Sección Introductoria Mejorada */}
<section className="py-20 bg-dark-light border-t border-border">
  <div className="container mx-auto px-6 max-w-4xl text-center">
    {/* Logotipo + Nombre */}
    <div className="flex items-center justify-center gap-4 mb-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-10 w-10 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M5 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M19 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 12h.01M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.5 12.5c.7-3.5 3-6 6.5-6h5c3.5 0 5.8 2.5 6.5 6-.7 3.5-3 6-6.5 6h-5c-3.5 0-5.8-2.5-6.5-6Z"
        />
      </svg>
      <h1 className="text-5xl md:text-6xl font-thin tracking-tight text-white">
        Viaggio Velogge
      </h1>
    </div>

    {/* Frase de marca */}
    <p className="text-xl text-primary font-light mb-10 max-w-2xl mx-auto">
      Donde el lujo se encuentra con la carretera.
    </p>

    {/* Línea divisoria */}
    <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-10"></div>

    {/* Texto introductorio */}
    <div className="prose prose-lg prose-invert max-w-none">
      <p className="text-text-secondary leading-relaxed mb-6">
        <strong>Viaggio Velogge</strong> nace de la pasión por lo extraordinario. No somos solo un catálogo de autos: somos un puente entre el lujo, la ingeniería y la emoción de conducir.
      </p>
      <p className="text-text-secondary leading-relaxed mb-6">
        Cada vehículo en nuestra colección ha sido seleccionado con rigor, no solo por su diseño o potencia, sino por la historia que representa.
      </p>
      <p className="text-text-secondary leading-relaxed">
        Ya seas coleccionista, entusiasta o futuro propietario de tu primer superdeportivo, aquí encontrarás más que un auto: encontrarás una experiencia.
      </p>
    </div>

    {/* Botón CTA */}
    <div className="mt-12 flex justify-center">
      <Link
        to="/cars"
        className="px-8 py-4 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors text-lg"
      >
        Explorar nuestra colección
      </Link>
    </div>
  </div>
</section>
    </div>
  );
};

export default Home;