// frontend/src/components/Header.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // ✅ ¡IMPORTADO!

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart(); // ✅ ¡OBTENIDO!
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-light border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold text-text hover:text-primary transition-colors">
          Viaggio Velogge
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link to="/cars" className="text-text hover:text-primary transition-colors">
            Autos
          </Link>
          <Link to="/accessories" className="text-text hover:text-primary transition-colors">
            Accesorios
          </Link>
          <Link to="/gallery" className="text-text hover:text-primary transition-colors">
            Galería
          </Link>
          <Link to="/consultation" className="text-text hover:text-primary transition-colors">
            Consulta
          </Link>
          <Link to="/compare" className="text-text hover:text-primary transition-colors">
            Comparar
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* 🛒 ¡NUEVO! Botón del Carrito */}
            <Link to="/cart" className="relative p-2 text-text hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-7H5.4M12 16v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v-2m0 0V8m0 8v......" />
              </svg>
              {/* Badge con contador */}
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* 🟢 Mostrar nombre de usuario y menú desplegable */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-text hover:text-primary transition-colors">
                <span className="font-medium">{user.username}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Menú desplegable */}
              <div className="absolute right-0 mt-2 w-48 bg-dark-light border border-border rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-text hover:bg-primary/10 transition-colors"
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors"
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
    </header>
  );
};

export default Header;