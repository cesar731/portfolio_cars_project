// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CarsCatalog from './pages/CarsCatalog';
import CarDetail from './pages/CarDetail';
import CompareCars from './pages/CompareCars';
import AccessoriesShop from './pages/AccessoriesShop';
import Cart from './pages/Cart';
import AccessoryDetail from './pages/AccessoryDetail';
import Consultation from './pages/Consultation';
import UserGallery from './pages/UserGallery';
import UserGalleryDetail from './pages/UserGalleryDetail';
import UserGalleryCreate from './pages/UserGalleryCreate';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import CarCreate from './pages/CarCreate';
import AccessoryCreate from './pages/AccessoryCreate';
import CarEdit from './pages/CarEdit';
import AccessoryEdit from './pages/AccessoryEdit';
import AdvisorPanel from './pages/AdvisorPanel';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';
import UserGalleryEdit from './pages/UserGalleryEdit';
import Checkout from './pages/Checkout';
import ChatPage from './pages/ChatPage';
import MyConsultations from './pages/MyConsultations';

// Componente auxiliar para manejar el token
function TokenHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      try {
        // Guardar token
        localStorage.setItem('token', token);
        toast.success('¡Bienvenido con Google!');

        // Limpiar el token de la URL
        window.history.replaceState({}, document.title, location.pathname);

        // Decodificar token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role_id = payload.role_id || 3;

        // Redirigir según rol
        if (role_id === 1) {
          navigate('/admin', { replace: true });
        } else if (role_id === 2) {
          navigate('/advisor', { replace: true });
        } else {
          // Ya estás en '/', pero podrías ir a perfil o dashboard
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error('Error procesando token:', err);
        toast.error('Error al iniciar sesión con Google');
        navigate('/login', { replace: true });
      }
    }
  }, [location, navigate]);

  return null;
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<CarsCatalog />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/compare" element={<CompareCars />} />
          <Route path="/accessories" element={<AccessoriesShop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/accessories/:id" element={<AccessoryDetail />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/gallery" element={<UserGallery />} />
          <Route path="/gallery/:id" element={<UserGalleryDetail />} />
          <Route path="/gallery/new" element={<UserGalleryCreate />} />
          <Route path="/gallery/edit/:id" element={<UserGalleryEdit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-consultations" element={<MyConsultations />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/cars/new" element={<CarCreate />} />
          <Route path="/cars/edit/:id" element={<CarEdit />} />
          <Route path="/accessories/new" element={<AccessoryCreate />} />
          <Route path="/accessories/edit/:id" element={<AccessoryEdit />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/advisor" element={<AdvisorPanel />} />
          <Route path="/chat/:consultationId" element={<ChatPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <TokenHandler />
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;