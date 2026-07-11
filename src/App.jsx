// ============================================================
// AHARYA – Root App Component with Routing
// ============================================================
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetailPage from './pages/ProductDetailPage';
import SuperuserDashboard from './components/SuperuserDashboard';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import SizeGuide from './pages/SizeGuide';
import Weavers from './pages/Weavers';
import ScrollToTop from './components/ScrollToTop';
import LoginPage from './pages/LoginPage';

export default function App() {
  const location = useLocation();
  const isSuperuser = location.pathname.startsWith('/superuser');
  
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <Toaster position="top-right" richColors />
        
        {/* Premium Micro-Loading Screen */}
        <AnimatePresence>
          {pageLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: '#ffffff',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1.5rem',
                paddingTop: '35vh'
              }}
            >
              <img 
                src="/assets/logo.jpg" 
                alt="Aharya" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div style={{
                width: '120px',
                height: '3px',
                background: '#f3f4f6',
                borderRadius: '3px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <motion.div
                  initial={{ left: '-100%' }}
                  animate={{ left: '100%' }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '50%',
                    background: 'var(--color-gold, #c8a84b)'
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isSuperuser ? (
          <Routes>
            <Route path="/superuser" element={<SuperuserDashboard />} />
          </Routes>
        ) : (
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, opacity: pageLoading ? 0 : 1, transition: 'opacity 0.2s ease-in-out' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/weavers" element={<Weavers />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/size-guide" element={<SizeGuide />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/account" element={<Account />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<LoginPage />} />
                {/* Fallback route */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            {!pageLoading && <Footer />}
          </div>
        )}
      </CartProvider>
    </AuthProvider>
  );
}
