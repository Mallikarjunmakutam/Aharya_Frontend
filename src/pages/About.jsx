import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: '120px 24px 80px',
        maxWidth: '1000px',
        margin: '0 auto',
        minHeight: '85vh',
        fontFamily: 'var(--font-body)',
        color: '#333'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ 
          fontFamily: 'var(--font-heading, serif)', 
          fontSize: '3.2rem', 
          color: 'var(--color-gold, #c8a84b)',
          marginBottom: '16px' 
        }}>About Āhāryā</h1>
        <p style={{ 
          fontSize: '1.25rem', 
          fontStyle: 'italic',
          color: '#555', 
          maxWidth: '750px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Aharya was born from a simple belief: the finest sarees deserve to come directly from the hands that create them.
        </p>
      </div>

      {/* Main Text Content */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px', 
        lineHeight: '1.85', 
        fontSize: '1.05rem',
        color: '#444',
        marginBottom: '60px'
      }}>
        <p>
          Across India, generations of skilled weavers have preserved the art of traditional handloom weaving, crafting sarees that carry stories of culture, heritage, and unmatched craftsmanship. Unfortunately, many of these artisans remain unseen, while their creations pass through multiple middlemen before reaching customers.
        </p>
        
        <div style={{ 
          borderLeft: '4px solid var(--color-gold)', 
          paddingLeft: '24px', 
          margin: '12px 0',
          fontWeight: '500',
          fontSize: '1.15rem',
          color: 'var(--color-gold)'
        }}>
          At Aharya, we are changing that.
        </div>

        <p>
          We work closely with traditional weaving communities across India to bring authentic handcrafted sarees directly from the weavers to you. Every saree in our collection is carefully selected for its quality, artistry, and cultural significance, ensuring that each piece reflects the true spirit of Indian craftsmanship.
        </p>
        <p>
          By sourcing directly from the artisans, we not only offer genuine handwoven sarees but also help support the livelihoods of the families who have kept these centuries-old traditions alive.
        </p>
        <p>
          Whether it is the timeless elegance of Kanchipuram Silk, the intricate beauty of Banarasi weaves, the vibrant artistry of Pochampally Ikat, or the grace of Chanderi and Maheshwari sarees, every Aharya collection celebrates India's rich textile heritage.
        </p>
        <p style={{ fontStyle: 'italic' }}>
          For us, a saree is more than a garment—it is a story woven with patience, tradition, and passion.
        </p>
        <p>
          Our mission is to preserve India's weaving legacy while making authentic, handcrafted sarees accessible to every woman who values elegance, culture, and craftsmanship.
        </p>
        <p style={{ fontWeight: '500', color: '#111' }}>
          At Aharya, every drape connects you directly to the hands that created it.
        </p>
      </div>

      {/* Promises Box */}
      <div style={{ 
        background: '#fcfbfa', 
        borderRadius: '16px', 
        padding: '40px',
        border: '1px solid #f0edf8',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.01)',
        marginBottom: '60px'
      }}>
        <h3 style={{ 
          fontFamily: 'var(--font-heading, serif)', 
          fontSize: '1.75rem', 
          color: '#111', 
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          🌸 Our Promise
        </h3>
        <ul style={{ 
          listStyleType: 'none', 
          padding: 0, 
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '650px',
          margin: '0 auto'
        }}>
          {[
            'Authentic sarees sourced directly from traditional weavers',
            'Fair support for artisan communities',
            'Premium quality with genuine craftsmanship',
            'Preserving India\'s rich textile heritage',
            'Bringing timeless tradition to modern wardrobes'
          ].map((promise, index) => (
            <li key={index} style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1.05rem' }}>
              <span style={{ color: 'var(--color-gold)', fontSize: '1.15rem' }}>✓</span>
              <span>{promise}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tagline */}
      <div style={{ 
        textAlign: 'center', 
        borderTop: '1px solid #eee', 
        paddingTop: '40px',
        marginTop: '40px'
      }}>
        <div style={{
          fontFamily: 'var(--font-heading, serif)',
          fontSize: '1.8rem',
          fontStyle: 'italic',
          color: 'var(--color-gold, #c8a84b)',
          letterSpacing: '0.05em'
        }}>
          "The Indian Diva's Closet"
        </div>
      </div>
    </motion.div>
  );
}
