// frontend/src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CarsCatalog from './pages/CarsCatalog';
import CarDetail from './pages/CarDetail';
import CompareCars from './pages/CompareCars';
import AccessoriesShop from './pages/AccessoriesShop';
import AccessoryDetail from './pages/AccessoryDetail';
import Consultation from './pages/Consultation';
import UserGallery from './pages/UserGallery';
import UserGalleryDetail from './pages/UserGalleryDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdvisorPanel from './pages/AdvisorPanel';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cars" element={<CarsCatalog />} />
                <Route path="/cars/:id" element={<CarDetail />} />
                <Route path="/compare" element={<CompareCars />} />
                <Route path="/accessories" element={<AccessoriesShop />} />
                <Route path="/accessories/:id" element={<AccessoryDetail />} />
                <Route path="/consultation" element={<Consultation />} />
                <Route path="/gallery" element={<UserGallery />} />
                <Route path="/gallery/:id" element={<UserGalleryDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/advisor" element={<AdvisorPanel />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;