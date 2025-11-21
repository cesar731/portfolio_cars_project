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
import ForgotPassword from './pages/ForgotPassword';
import VerifyCode from './pages/VerifyCode';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';  // ✅ Nuevo

function TokenHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (error) {
      let errorMessage = "Hubo un problema con la autenticación.";
      switch (error) {
        case 'access_denied':
          errorMessage = "Has cancelado el inicio de sesión con Google.";
          break;
        case 'no_code_provided':
          errorMessage = "No se recibió el código de autorización.";
          break;
        case 'token_exchange_failed':
          errorMessage = `Fallo al obtener el token: ${errorDescription || 'Error desconocido'}`;
          break;
        case 'unexpected_error':
          errorMessage = "Ocurrió un error inesperado durante el inicio de sesión.";
          break;
        default:
          errorMessage = `Error: ${error} - ${errorDescription || ''}`;
      }

      toast.error(errorMessage);
      window.history.replaceState({}, document.title, location.pathname);
      navigate('/login', { replace: true });
      return;
    }

    const token = urlParams.get('token');
    if (token) {
      try {
        localStorage.setItem('token', token);
        toast.success('¡Bienvenido con Google!');
        window.history.replaceState({}, document.title, location.pathname);

        const payload = JSON.parse(atob(token.split('.')[1]));
        const role_id = payload.role_id || 3;

        if (role_id === 1) {
          navigate('/admin', { replace: true });
        } else if (role_id === 2) {
          navigate('/advisor', { replace: true });
        } else {
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/verify-email" element={<VerifyEmail />} /> {/* ✅ Nuevo */}
          <Route path="/reset-password" element={<ResetPassword />} />
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