import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent to aharyastore@gmail.com.");
      setForm({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1200);
  };

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
        minHeight: '80vh',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-dark)'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ 
          fontFamily: 'var(--font-heading, serif)', 
          fontSize: '3rem', 
          color: 'var(--color-gold, #c8a84b)',
          marginBottom: '16px' 
        }}>Contact Us</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Have any inquiries about fabrics, custom designs, or orders? Drop us a line.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '60px'
      }}>
        {/* Info Col */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '2.0rem', marginBottom: '24px' }}>
            Get In Touch
          </h2>
          <p style={{ lineHeight: '1.7', color: '#555', marginBottom: '32px' }}>
            We would love to help you find your perfect look. Write to us or reach out via our email support for custom bridal consultations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>✉</div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#888' }}>Email Address</strong>
                <a href="mailto:aharyastore@gmail.com" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontWeight: '500' }}>
                  aharyastore@gmail.com
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>📍</div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#888' }}>Flagship Boutique</strong>
                <span style={{ color: '#444' }}>Aharya Design Studio, Jubilee Hills, Hyderabad, India</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>⏰</div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#888' }}>Studio Hours</strong>
                <span style={{ color: '#444' }}>Monday – Saturday: 10:00 AM – 7:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Col */}
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid #eee',
          boxShadow: '0 4px 30px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.6rem', marginBottom: '24px' }}>
            Send Message
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', color: '#666' }}>
                Your Name *
              </label>
              <input 
                type="text"
                required
                placeholder="Priya Sharma"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid #ddd',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', color: '#666' }}>
                Email Address *
              </label>
              <input 
                type="email"
                required
                placeholder="priya@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid #ddd',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', color: '#666' }}>
                Subject
              </label>
              <input 
                type="text"
                placeholder="Bridal collection inquiry"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid #ddd',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', color: '#666' }}>
                Your Message *
              </label>
              <textarea 
                required
                rows="4"
                placeholder="Write your query here..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid #ddd',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '0.95rem',
                  resize: 'none'
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '30px',
                background: 'var(--color-black, #000)',
                color: 'white',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginTop: '8px'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--color-gold)'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--color-black)'}
            >
              {submitting ? 'Sending...' : 'Submit Message'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
