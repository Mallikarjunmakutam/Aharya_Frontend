// ============================================================
// AHARYA – Model Carousel Section
// ============================================================
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroModels } from '../data/products';
import s from './ModelCarousel.module.css';

const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
  </svg>
);

const getCardStyle = (index, center, total) => {
  const diff = (index - center + total) % total;
  const relDiff = diff > total / 2 ? diff - total : diff;
  
  if (relDiff === 0) {
    return { x: 0, scale: 1, zIndex: 10, opacity: 1, rotateY: 0 };
  } else if (relDiff === 1) {
    return { x: 250, scale: 0.85, zIndex: 5, opacity: 0.7, rotateY: -15 };
  } else if (relDiff === -1) {
    return { x: -250, scale: 0.85, zIndex: 5, opacity: 0.7, rotateY: 15 };
  } else if (relDiff === 2) {
    return { x: 450, scale: 0.7, zIndex: 2, opacity: 0.3, rotateY: -25 };
  } else if (relDiff === -2) {
    return { x: -450, scale: 0.7, zIndex: 2, opacity: 0.3, rotateY: 25 };
  }
  return { x: 0, scale: 0.6, zIndex: 1, opacity: 0, rotateY: 0 };
};

export default function ModelCarousel() {
  const [center, setCenter] = useState(2);
  const total = heroModels.length;

  const next = useCallback(() => setCenter(c => (c + 1) % total), [total]);
  const prev = useCallback(() => setCenter(c => (c - 1 + total) % total), [total]);

  // Auto slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className={s.section}>
      <div className={s.titleBox}>
        <h2 className={s.title}>The Aharya Muse</h2>
        <div className={s.subtitle}>Elegance Personified</div>
      </div>

      <div className={s.carouselStage}>
        <div className={s.modelsRow}>
          {heroModels.map((model, i) => {
            const style = getCardStyle(i, center, total);
            return (
              <motion.div
                key={model.id}
                className={s.modelCard}
                onClick={() => style.x !== 0 && setCenter(i)}
                initial={false}
                animate={{
                  x: style.x,
                  scale: style.scale,
                  zIndex: style.zIndex,
                  opacity: style.opacity,
                  rotateY: style.rotateY
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              >
                <div className={s.modelImgWrap}>
                  <img
                    src={model.image}
                    alt={model.name}
                    className={s.modelImg}
                    loading="lazy"
                  />
                </div>
                <AnimatePresence>
                  {style.x === 0 && (
                    <motion.div
                      className={s.centerLabel}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <div className={s.centerLabelType}>{model.type}</div>
                      <div className={s.centerLabelName}>{model.name}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className={s.controls}>
        <div className={s.arrowsRow}>
          <button className={s.arrowBtn} onClick={prev} aria-label="Previous model">
            <ArrowLeft />
          </button>
          <button className={s.arrowBtn} onClick={next} aria-label="Next model">
            <ArrowRight />
          </button>
        </div>
        <div className={s.dotsRow}>
          {heroModels.map((_, i) => (
            <button
              key={i}
              className={`${s.dot} ${i === center ? s.active : ''}`}
              onClick={() => setCenter(i)}
              aria-label={`Go to model ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
