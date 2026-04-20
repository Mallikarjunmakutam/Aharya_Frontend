// ============================================================
// AHARYA – Split Layout Hero Section
// ============================================================
import { motion } from 'framer-motion';
import s from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section id="hero" className={s.hero}>
      {/* Background Texture/Gradient */}
      <div className={s.heroBg} />

      <div className={s.container}>
        <div className={s.grid}>
          
          {/* Left Text Content */}
          <motion.div 
            className={s.textCol}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={s.heroEyebrow}>
              <span className={s.eyebrowLine} />
              The Indian Diva's Closet
            </div>
            
            <h1 className={s.heroTitle}>
              Draped in <br/><em>Elegance</em>,<br/>
              Woven in <br/><em>Heritage</em>
            </h1>
            
            <p className={s.heroDesc}>
              Discover our curated collection of luxury handcrafted sarees. A love letter to timeless Indian craftsmanship.
            </p>
            
            <div className={s.ctaGroup}>
              <button 
                className={s.primaryBtn} 
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className={s.btnText}>Shop Collection</span>
                <span className={s.btnShine} />
              </button>
              <button className={s.secondaryBtn}>
                Explore Lookbook
              </button>
            </div>
          </motion.div>

          {/* Right Image Content */}
          <motion.div 
            className={s.imageCol}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={s.imageWrap}>
              <img 
                src="/assets/product8.jpg" 
                alt="Luxury Saree Model" 
                className={s.heroImg} 
                loading="eager"
              />
              <div className={s.imageOverlay} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
