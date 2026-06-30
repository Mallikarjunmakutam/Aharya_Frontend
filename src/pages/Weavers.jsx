import { motion } from 'framer-motion';

export default function Weavers() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        padding: '120px 24px 80px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '85vh',
        fontFamily: 'var(--font-body)',
        color: '#333'
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ 
          fontFamily: 'var(--font-heading, serif)', 
          fontSize: '3rem', 
          color: 'var(--color-gold, #c8a84b)',
          marginBottom: '16px',
          lineHeight: '1.2'
        }}>The Hands That Weave Our Heritage</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', margin: '0 auto', fontStyle: 'italic', lineHeight: '1.6' }}>
          Long before an Aharya saree finds its place in your wardrobe, its journey begins in a humble weaving workshop...
        </p>
      </div>

      {/* Row 1 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '48px', 
        alignItems: 'center',
        marginBottom: '80px'
      }}>
        <div>
          <img 
            src="/assets/weaver1.jpg" 
            alt="Artisans weaving" 
            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }} 
          />
        </div>
        <div>
          <p style={{ lineHeight: '1.9', color: '#444', fontSize: '1.05rem', marginBottom: '16px' }}>
            Where the rhythmic sound of wooden looms echoes through the day, every thread is woven with patience, dedication, and generations of inherited skill.
          </p>
          <p style={{ lineHeight: '1.9', color: '#444', fontSize: '1.05rem' }}>
            These are not factories driven by machines. They are homes of craftsmanship, where families have devoted their lives to preserving an art that has been passed down from parents to children for centuries. Every loom tells a different story, every artisan carries a different legacy, yet they all share one common purpose—to keep India's weaving heritage alive.
          </p>
        </div>
      </div>

      {/* Row 2 (Alternating layout) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '48px', 
        alignItems: 'center',
        marginBottom: '80px'
      }}>
        <div style={{ order: window.innerWidth > 768 ? 2 : 1 }}>
          <img 
            src="/assets/weaver2.jpg" 
            alt="Intricate wooden looms" 
            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }} 
          />
        </div>
        <div style={{ order: window.innerWidth > 768 ? 1 : 2 }}>
          <p style={{ lineHeight: '1.9', color: '#444', fontSize: '1.05rem', marginBottom: '16px' }}>
            The process begins with carefully preparing the threads, selecting colours, and setting up the loom, a task that itself can take several days. Only then does the real weaving begin.
          </p>
          <p style={{ lineHeight: '1.9', color: '#444', fontSize: '1.05rem' }}>
            Inch by inch, thread by thread, a saree slowly comes to life. There are no shortcuts. Every pattern, every border, and every intricate design is created entirely by hand, demanding extraordinary patience and precision.
          </p>
        </div>
      </div>

      {/* Row 3 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '48px', 
        alignItems: 'center',
        marginBottom: '80px'
      }}>
        <div>
          <img 
            src="/assets/weaver3.jpg" 
            alt="Elderly artisan at loom" 
            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }} 
          />
        </div>
        <div>
          <p style={{ lineHeight: '1.9', color: '#444', fontSize: '1.05rem', marginBottom: '16px' }}>
            Among these skilled artisans are elderly weavers who continue working with the same passion they had decades ago. Their hands may have aged, but their craftsmanship remains unmatched.
          </p>
          <p style={{ lineHeight: '1.9', color: '#444', fontSize: '1.05rem' }}>
            Years of experience allow them to create patterns that no machine can truly replicate. Each movement of the loom reflects a lifetime of dedication to an art they refuse to let fade away.
          </p>
        </div>
      </div>

      {/* Highlight Box */}
      <div style={{ 
        background: '#fcfbfa', 
        borderLeft: '4px solid var(--color-gold, #c8a84b)', 
        borderRadius: '0 16px 16px 0',
        padding: '36px',
        marginBottom: '60px',
        lineHeight: '1.8'
      }}>
        <p style={{ fontSize: '1.1rem', color: '#555', margin: 0, fontStyle: 'italic' }}>
          "Yet despite creating some of India's most beautiful sarees, many weavers remain unseen. Their masterpieces often pass through multiple middlemen before reaching customers, while the artisans themselves receive little recognition for their extraordinary work. Aharya was founded to change that."
        </p>
      </div>

      {/* Narrative Summary */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px', 
        lineHeight: '1.9', 
        fontSize: '1.05rem',
        color: '#444',
        marginBottom: '50px'
      }}>
        <p>
          We believe that every saree deserves to carry not only beauty but also the story of the hands that created it. By working directly with traditional weaving communities, we bring authentic handcrafted sarees from the loom to your wardrobe while supporting the artisans who have preserved this remarkable heritage for generations.
        </p>
        <p>
          Every Aharya saree is more than a piece of clothing. It carries days of meticulous craftsmanship, years of inherited knowledge, and the dreams of families whose livelihoods depend on this timeless tradition.
        </p>
        <p style={{ fontWeight: '600', color: '#111' }}>
          When you choose Aharya, you are not simply purchasing a saree—you are becoming a part of a story. A story of tradition over trends, craftsmanship over mass production, and people over profit.
        </p>
        <p>
          Your purchase helps preserve an art that has defined India's cultural identity for centuries and ensures that these wooden looms continue to weave stories for generations to come.
        </p>
      </div>

      {/* Sign-off Quote */}
      <div style={{ 
        textAlign: 'center', 
        borderTop: '1px solid #eee', 
        paddingTop: '40px',
        fontFamily: 'var(--font-heading, serif)',
        fontSize: '1.45rem',
        color: 'var(--color-gold)',
        fontStyle: 'italic'
      }}>
        "Because every thread has a beginning, every weave has a purpose, and every Aharya saree carries the soul of the artisan who created it."
      </div>
    </motion.div>
  );
}
