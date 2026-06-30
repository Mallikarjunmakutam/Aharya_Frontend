// ============================================================
// AHARYA – Social Section
// ============================================================
import { motion } from 'framer-motion';
import s from './SocialSection.module.css';

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const images = [
  "/assets/saree1.png",
  "/assets/saree2.jpg",
  "/assets/saree3.jpg",
  "/assets/saree4.jpg",
  "/assets/saree5.jpg",
  "/assets/product6.jpg"
];

export default function SocialSection() {
  return (
    <section className={s.section}>
      <motion.div 
        className={s.header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={s.subtitle}>Celebrating Handloom</div>
        <h2 className={s.title}>About Our Journey</h2>
      </motion.div>

      <div className={s.grid}>
        {images.map((img, i) => (
          <motion.div 
            key={i} 
            className={s.imgWrap}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <img src={img} alt="Aharya Social" className={s.img} loading="lazy" />
            <div className={s.overlay}>
              <div className={s.overlayText}>
                <InstagramIcon /> View Look
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
