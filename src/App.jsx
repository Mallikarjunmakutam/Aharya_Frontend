// ============================================================
// AHARYA – Root App Component with Routing
// ============================================================
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetailPage from './pages/ProductDetailPage';
import SuperuserDashboard from './components/SuperuserDashboard';

export default function App() {
  const location = useLocation();
  const isSuperuser = location.pathname.startsWith('/superuser');

  return (
    <AuthProvider>
      <CartProvider>
        {isSuperuser ? (
          <Routes>
            <Route path="/superuser" element={<SuperuserDashboard />} />
          </Routes>
        ) : (
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                {/* Fallback route */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        )}
      </CartProvider>
    </AuthProvider>
  );
}
