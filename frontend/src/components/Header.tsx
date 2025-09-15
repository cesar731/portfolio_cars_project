// frontend/src/components/Header.jsx


import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          VIAGGIO VELOGGE
        </Link>
        
        <nav className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Inicio
          </Link>
          
          <Link 
            to="/cars" 
            className={`nav-link ${location.pathname === '/cars' ? 'active' : ''}`}
          >
            Catálogo
          </Link>
          
          <Link 
            to="/accessories" 
            className={`nav-link ${location.pathname === '/accessories' ? 'active' : ''}`}
          >
            Accesorios
          </Link>
          
          <Link 
            to="/gallery" 
            className={`nav-link ${location.pathname === '/gallery' ? 'active' : ''}`}
          >
            Galería
          </Link>
          
          <Link 
            to="/consultation" 
            className={`nav-link ${location.pathname === '/consultation' ? 'active' : ''}`}
          >
            Asesoría
          </Link>
          
          <Link 
            to="/compare" 
            className={`nav-link ${location.pathname === '/compare' ? 'active' : ''}`}
          >
            Comparar
          </Link>
        </nav>

        <div className="header-auth">
          <Link to="/login" className="btn btn-outline">Iniciar sesión</Link>
          <Link to="/register" className="btn btn-primary">Registrarse</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;