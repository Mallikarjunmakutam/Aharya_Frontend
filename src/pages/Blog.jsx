import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Heritage', 'Styling Tips', 'Fashion', 'Festivals', 'Handloom', 'Behind the Loom'];

const articles = [
  {
    id: 1,
    title: 'The Journey of a Saree',
    category: 'Handloom',
    excerpt: 'How a single saree is transformed from yarn into a masterpiece through weeks of craftsmanship.',
    content: 'The journey of a saree is a story of patience and skill. Starting from raw silk or cotton yarns, the weaver carefully dyes the threads in rich colors. Setting up the warp and weft on a traditional wooden loom is a meticulous process that can take up to a week. Once set, the weaver weaves thread by thread, combining intricate patterns and borders. A single premium saree takes weeks of dedication and stands as a unique work of art.',
    image: '/assets/saree3.jpg',
    readTime: '6 min read'
  },
  {
    id: 2,
    title: 'Why Handloom Sarees Are Worth Every Rupee',
    category: 'Behind the Loom',
    excerpt: 'Explain the difference between handloom and powerloom and why handcrafted legacy stands tall.',
    content: 'Unlike mass-produced powerloom fabrics, handloom sarees carry the touch of human artistry. Handweaving creates small, natural variations that give character and strength to the fabric. Powerlooms produce stiff, repetitive patterns, whereas handlooms allow organic softness, breathability, and custom design details. Sourcing a handloom saree directly supports artisan livelihoods and preserves a legacy of textile engineering that is generations old.',
    image: '/assets/weaver1.jpg',
    readTime: '4 min read'
  },
  {
    id: 3,
    title: 'The History Behind Pochampally Ikat',
    category: 'Heritage',
    excerpt: 'Tell the origin and significance of this unique double-bind dyeing technique.',
    content: 'Pochampally Ikat, originating from the silk city of Bhoodan Pochampally in Telangana, is celebrated for its geometric patterns and tie-dye methods. Known as "Chakra" weave, the design is transferred onto the yarns before weaving begins. This complex process demands mathematical precision, as both the warp and weft yarns are dyed separately to align during weaving, resulting in vibrant colors and captivating shapes.',
    image: '/assets/saree1.png',
    readTime: '5 min read'
  },
  {
    id: 4,
    title: 'How to Identify an Authentic Silk Saree',
    category: 'Styling Tips',
    excerpt: 'A helpful guide to verifying genuine mulberry or tussar silk and avoiding synthetics.',
    content: 'Authentic silk carries a natural sheen that reflects light in multiple colors, whereas synthetic fabrics reflect in white light. To identify genuine silk, perform the "ring test" (pure silk easily slides through a wedding ring) or look for the government Silk Mark label. Genuine handwoven silk sarees also feature unique imperfections on the reverse side, showing the manual loom adjustments.',
    image: '/assets/saree4.jpg',
    readTime: '3 min read'
  },
  {
    id: 5,
    title: 'Saree Trends for Weddings in 2026',
    category: 'Fashion',
    excerpt: 'The latest fashion directions, color choices, and weave hybrids dominating this wedding season.',
    content: 'This year, brides are embracing heritage weaves with modern color combinations. Pastels mixed with heavy gold Banarasi borders, double-color Kanchipuram silks, and lightweight tissue sarees are the top trends. Sustainability is also key, with brides opting for natural organic cotton-silk blends and vintage layouts recreated by master weavers.',
    image: '/assets/logo.jpg',
    readTime: '4 min read'
  },
  {
    id: 6,
    title: 'Caring for Handwoven Sarees',
    category: 'Styling Tips',
    excerpt: 'Helpful care guidelines on cleaning, storage, and preservation. Click here to read our detailed guide.',
    content: 'To preserve your handwoven sarees for generations, always dry clean them first. Store them in soft cotton muslin bags rather than plastic covers to let the fibers breathe. Avoid direct sunlight when airing them out, and change the folding lines every few months to prevent thread damage along the creases.',
    image: '/assets/weaver3.jpg',
    readTime: '5 min read',
    linkToAbout: true
  },
  {
    id: 7,
    title: 'Meet Our Weavers',
    category: 'Behind the Loom',
    excerpt: 'Tell the personal stories and family legacies of the artisan families behind Aharya.',
    content: 'Behind every drape lies the dedication of artisan families. Meet weavers like Devendra and his family in Andhra Pradesh, who have operated wooden looms for over four generations. Direct partnerships with Aharya ensure they receive fair compensation, enabling them to invest in loom updates and fund education for their children.',
    image: '/assets/weaver2.jpg',
    readTime: '7 min read'
  }
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const navigate = useNavigate();

  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  const handleArticleClick = (article) => {
    if (article.linkToAbout) {
      navigate('/about');
    } else {
      setSelectedArticle(article);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: '120px 24px 80px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '85vh',
        fontFamily: 'var(--font-body)',
        color: '#333'
      }}
    >
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '48px', borderBottom: '2px solid #111', paddingBottom: '32px' }}>
        <h1 style={{ 
          fontFamily: 'var(--font-heading, serif)', 
          fontSize: '3.6rem', 
          color: '#111',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>Aharya Journal</h1>
        <p style={{ 
          fontSize: '1.25rem', 
          fontStyle: 'italic',
          color: 'var(--color-gold, #c8a84b)', 
          margin: 0,
          fontWeight: '500'
        }}>
          "Stories of Heritage, Handloom & Timeless Elegance."
        </p>
      </div>

      {/* Categories Row */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        flexWrap: 'wrap', 
        gap: '12px', 
        marginBottom: '48px',
        paddingBottom: '16px',
        borderBottom: '1px solid #eee'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: activeCategory === cat ? '1px solid #111' : '1px solid #eee',
              background: activeCategory === cat ? '#111' : 'transparent',
              color: activeCategory === cat ? 'white' : '#555',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Editorial Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '40px'
      }}>
        {filteredArticles.map(article => (
          <article 
            key={article.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              cursor: 'pointer',
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: '24px'
            }}
            onClick={() => handleArticleClick(article)}
          >
            <div style={{
              aspectRatio: '16/10',
              overflow: 'hidden',
              borderRadius: '8px',
              background: '#f9f9f9'
            }}>
              <img 
                src={article.image} 
                alt="" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
            
            <div>
              <span style={{ 
                fontSize: '0.72rem', 
                textTransform: 'uppercase', 
                color: 'var(--color-gold)', 
                fontWeight: '600',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '6px'
              }}>
                {article.category} • {article.readTime}
              </span>
              
              <h2 style={{
                fontFamily: 'var(--font-heading, serif)',
                fontSize: '1.45rem',
                color: '#111',
                margin: '0 0 10px 0',
                lineHeight: '1.3'
              }}>
                {article.title}
              </h2>
              
              <p style={{
                fontSize: '0.92rem',
                lineHeight: '1.6',
                color: '#666',
                margin: '0 0 16px 0'
              }}>
                {article.excerpt}
              </p>
              
              <span style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#111',
                borderBottom: '1px solid #111',
                paddingBottom: '2px',
                display: 'inline-block'
              }}>
                Read More
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Article Detail Modal Overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'white',
                maxWidth: '650px',
                width: '100%',
                maxHeight: '85vh',
                overflowY: 'auto',
                borderRadius: '16px',
                padding: '36px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#aaa'
                }}
              >
                ✕
              </button>

              <span style={{ 
                fontSize: '0.72rem', 
                textTransform: 'uppercase', 
                color: 'var(--color-gold)', 
                fontWeight: '600',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '8px'
              }}>
                {selectedArticle.category} • {selectedArticle.readTime}
              </span>
              
              <h2 style={{
                fontFamily: 'var(--font-heading, serif)',
                fontSize: '2rem',
                color: '#111',
                margin: '0 0 20px 0',
                lineHeight: '1.2'
              }}>
                {selectedArticle.title}
              </h2>

              <img 
                src={selectedArticle.image} 
                alt="" 
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '24px' }} 
                onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
              />

              <p style={{
                fontSize: '1.05rem',
                lineHeight: '1.8',
                color: '#333',
                margin: 0
              }}>
                {selectedArticle.content}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
