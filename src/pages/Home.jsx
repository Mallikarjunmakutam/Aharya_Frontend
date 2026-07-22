import HeroSection from '../components/HeroSection';
import ModelCarousel from '../components/ModelCarousel';
import AboutSection from '../components/AboutSection';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ModelCarousel />
      <AboutSection />
      <FeaturedProducts />
    </>
  );
}
