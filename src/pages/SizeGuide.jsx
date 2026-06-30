import { motion } from 'framer-motion';

export default function SizeGuide() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: '120px 24px 80px',
        maxWidth: '800px',
        margin: '0 auto',
        minHeight: '85vh',
        fontFamily: 'var(--font-body)',
        color: '#333'
      }}
    >
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ 
          fontFamily: 'var(--font-heading, serif)', 
          fontSize: '3.2rem', 
          color: 'var(--color-gold, #c8a84b)',
          marginBottom: '16px' 
        }}>Size Guide</h1>
        <p style={{ 
          fontSize: '1.25rem', 
          fontStyle: 'italic',
          color: '#555', 
          maxWidth: '650px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          "Every Aharya saree comes in a universal drape, designed to suit every woman."
        </p>
      </div>

      {/* Info Block */}
      <div style={{
        lineHeight: '1.8',
        fontSize: '1.05rem',
        color: '#555',
        textAlign: 'center',
        marginBottom: '48px',
        maxWidth: '600px',
        margin: '0 auto 48px'
      }}>
        At Āhāryā, our sarees are woven following the traditional Indian standards. They are designed to fit all body shapes, sizes, and heights beautifully, allowing you to drape, pleat, and style according to your preference.
      </div>

      {/* Table */}
      <div style={{
        background: 'white',
        border: '1.5px solid var(--color-gold, #c8a84b)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        marginBottom: '50px'
      }}>
        <div style={{
          background: 'var(--color-gold-pale, #fcfaf5)',
          padding: '16px 24px',
          borderBottom: '1.5px solid var(--color-gold)',
          fontWeight: '600',
          fontSize: '1.15rem',
          color: 'var(--color-gold)',
          fontFamily: 'var(--font-heading, serif)',
          textAlign: 'center'
        }}>
          Standard Measurements
        </div>
        
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '1.05rem',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: '500', width: '50%' }}>Part</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: '500', width: '50%' }}>Size</th>
            </tr>
          </thead>
          <tbody>
            {[
              { part: 'Saree Length', size: '5.5 meters' },
              { part: 'Blouse Piece', size: '0.8 meters' },
              { part: 'Total Length', size: '6.3 meters' },
              { part: 'Width', size: '44-46 inches' }
            ].map((row, idx) => (
              <tr key={idx} style={{ borderBottom: idx < 3 ? '1px solid #eee' : 'none' }}>
                <td style={{ padding: '18px 24px', fontWeight: '600', color: '#111' }}>{row.part}</td>
                <td style={{ padding: '18px 24px', color: '#444' }}>{row.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#777',
        fontStyle: 'italic'
      }}>
        * Note: The blouse piece comes attached to the saree and can be cut and customized according to your custom style and sizing requirements.
      </div>
    </motion.div>
  );
}
