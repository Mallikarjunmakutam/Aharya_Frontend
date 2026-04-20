// ============================================================
// AHARYA – Testimonial Section
// ============================================================
import { motion } from 'framer-motion';
import s from './TestimonialSection.module.css';

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

const testimonials = [
  {
    id: 1,
    name: "Anjali Desai",
    city: "Mumbai",
    text: "The silk quality is beyond comparison. Wore the Magenta Majesty at my sister's wedding and received endless compliments. Truly heirloom pieces.",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Sharma",
    city: "Delhi",
    text: "Aharya’s customer service is as premium as their sarees. The drape falls beautifully and feels so incredibly light yet luxurious.",
    image: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    rating: 5
  },
  {
    id: 3,
    name: "Kavya Reddy",
    city: "Hyderabad",
    text: "I am amazed by the detailing and traditional motifs. It completely transformed my festive look. I will definitely be a lifelong customer.",
    image: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    rating: 5
  }
];

export default function TestimonialSection() {
  return (
    <section className={s.section}>
      <div className="container">
        <motion.div 
          className={s.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={s.subtitle}>Voices of Aharya</div>
          <h2 className={s.title}>Loved by Women Across India</h2>
        </motion.div>

        <div className={s.grid}>
          {testimonials.map((t, i) => (
            <motion.div 
              key={t.id} 
              className={s.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className={s.avatarWrap}>
                <img src={t.image} alt={t.name} className={s.avatar} loading="lazy" />
              </div>
              <div className={s.stars}>
                {[...Array(t.rating)].map((_, idx) => <StarIcon key={idx} />)}
              </div>
              <p className={s.quote}>{t.text}</p>
              <div className={s.authorName}>{t.name}</div>
              <div className={s.authorCity}>{t.city}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
