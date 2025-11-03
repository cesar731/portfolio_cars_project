// frontend/src/components/Header.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ Controla el menú hamburguesa

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Autos', path: '/cars' },
    { label: 'Accesorios', path: '/accessories' },
    { label: 'Galería', path: '/gallery' },
    { label: 'Consulta', path: '/consultation' },
    { label: 'Comparar', path: '/compare' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-light border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-text hover:text-primary transition-colors">
          Viaggio Velogge
        </Link>

        {/* Menú hamburguesa (solo en móvil) */}
        <button
          className="md:hidden text-text"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Menú de escritorio (oculto en móvil) */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-text hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Botones de autenticación / carrito (escritorio) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {/* Carrito */}
              <Link to="/cart" className="relative p-2 text-text hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-7H5.4M7 13L5.4 15M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Menú de usuario */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-text hover:text-primary transition-colors">
                  <span className="font-medium">{user.username}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-dark-light border border-border rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-text hover:bg-primary/10 transition-colors">
                    Mi Perfil
                  </Link>
                  {user.role_id === 1 && (
                    <Link to="/admin" className="block px-4 py-2 text-text hover:bg-primary/10 transition-colors">
                      Panel de Administrador
                    </Link>
                  )}
                  {user.role_id === 2 && (
                    <Link to="/advisor" className="block px-4 py-2 text-text hover:bg-primary/10 transition-colors">
                      Panel de Asesor
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors border-t border-border/30 mt-1 pt-1"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 bg-primary text-text rounded-lg hover:bg-primary/90 transition-colors text-sm">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="px-4 py-2 bg-transparent border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menú móvil (solo visible cuando isMenuOpen = true) */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-border/30">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-text hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/cart"
                  className="text-text hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🛒 Carrito ({cartItems.length})
                </Link>
                <Link
                  to="/profile"
                  className="text-text hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
                {user.role_id === 1 && (
                  <Link
                    to="/admin"
                    className="text-text hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Panel de Administrador
                  </Link>
                )}
                {user.role_id === 2 && (
                  <Link
                    to="/advisor"
                    className="text-text hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Panel de Asesor
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors py-2 text-left"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;