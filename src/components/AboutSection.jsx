// ============================================================
// AHARYA – About Brand Section
// ============================================================
import { motion } from 'framer-motion';
import s from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section className={s.section} id="about">
      <div className="container">
        <div className={s.grid}>
          {/* Image */}
          <motion.div 
            className={s.imageCol}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className={s.bgBlob} />
            <div className={s.imageWrap}>
              <img src="/assets/saree3.jpg" alt="Artisan weaving a saree" className={s.img} loading="lazy" />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div 
            className={s.textCol}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={s.subtitle}>Our Heritage</div>
            <h2 className={s.title}>
              Celebrating Timeless Craftsmanship
            </h2>
            <p className={s.desc}>
              Aharya celebrates timeless Indian craftsmanship through sarees handcrafted by master artisans. Every weave tells a story of tradition passed down through generations, bringing you luxury that lasts a lifetime.
            </p>
            <p className={s.desc}>
              We believe in sustainability, empowering our weavers, and presenting the finest natural fabrics spanning the length and breadth of India.
            </p>
            <div className={s.signature}>Aharya Design Studio</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
