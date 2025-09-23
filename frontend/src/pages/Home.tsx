
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-dark text-text">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557598853-d41249562155?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-no-repeat opacity-90"></div>
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-light text-secondary leading-none tracking-tight mb-6">
            Viaggio Velogge
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-2xl mx-auto">
            Descubre la excelencia automotriz. Catálogo exclusivo, asesoría personalizada y experiencia premium.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/cars" className="px-8 py-4 border border-accent text-accent hover:bg-accent hover:text-dark transition-colors font-normal">
              Ver Catálogo
            </Link>
            <Link to="/consultation" className="px-8 py-4 bg-accent text-dark hover:bg-secondary hover:text-accent transition-colors font-normal">
              Solicitar Asesoría
            </Link>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <div className="container mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Catálogo */}
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl border border-border">
              <img src="https://tse1.mm.bing.net/th/id/OIP.fs3B4FhX4L0n-pI7BS2UBAHaF7?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Catálogo de Autos" className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-light text-secondary">Catálogo de Autos</h3>
                <p className="text-text-secondary mt-2">Explora vehículos de alta gama con especificaciones técnicas detalladas.</p>
              </div>
            </div>
            <Link to="/cars" className="mt-6 inline-block text-accent hover:text-secondary transition-colors">
              Ver detalles →
            </Link>
          </div>

          {/* Accesorios */}
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl border border-border">
              <img src="https://img.freepik.com/premium-vector/tire-tread-vector-elements-clip-art-illustration-tire-tread-cartoon-isolated_609667-858.jpg?w=2000" alt="Accesorios" className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-light text-secondary">Accesorios Premium</h3>
                <p className="text-text-secondary mt-2">Ruedas, llantas, interiores y más, diseñados para cada modelo.</p>
              </div>
            </div>
            <Link to="/accessories" className="mt-6 inline-block text-accent hover:text-secondary transition-colors">
              Ver detalles →
            </Link>
          </div>

          {/* Asesoría */}
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl border border-border">
              <img src="https://img.freepik.com/premium-vector/customer-comment-icon_192037-5726.jpg" alt="Asesoría" className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-light text-secondary">Asesoría Personalizada</h3>
                <p className="text-text-secondary mt-2">Conoce tu próximo vehículo con un experto dedicado.</p>
              </div>
            </div>
            <Link to="/consultation" className="mt-6 inline-block text-accent hover:text-secondary transition-colors">
              Ver detalles →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;