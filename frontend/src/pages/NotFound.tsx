// frontend/src/pages/NotFound.tsx

import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark text-text flex flex-col items-center justify-center p-12">
      <h1 className="text-9xl font-bold text-text-secondary mb-4">404</h1>
      <h2 className="text-3xl font-light text-text mb-8">Página no encontrada</h2>
      <p className="text-text-secondary text-lg mb-12 max-w-md text-center">
        La página que buscas no existe o ha sido movida. Por favor, revisa la URL o regresa al inicio.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-primary text-text rounded-lg font-medium hover:bg-primary/90 transition-colors text-lg"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFound;