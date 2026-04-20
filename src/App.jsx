// ============================================================
// AHARYA – Root App Component
// ============================================================
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ModelCarousel from './components/ModelCarousel';
import ProductSection from './components/ProductSection';
import AboutSection from './components/AboutSection';
import TestimonialSection from './components/TestimonialSection';
import SocialSection from './components/SocialSection';
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header onSearch={setSearchQuery} />
          <main style={{ flex: 1 }}>
            {selectedProduct ? (
              <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />
            ) : (
              <>
                <HeroSection onSelectProduct={handleSelectProduct} />
                <ModelCarousel />
                <ProductSection searchQuery={searchQuery} onSelectProduct={handleSelectProduct} />
                <AboutSection />
                <TestimonialSection />
                <SocialSection />
              </>
            )}
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
