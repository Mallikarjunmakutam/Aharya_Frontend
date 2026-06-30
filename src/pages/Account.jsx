import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import api from '../services/api';

export default function Account() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updating, setUpdating] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setUpdating(true);
    try {
      const res = await api.patch('/users/profile/', {
        full_name: fullName,
        phone: phone
      });

      // Update local storage for auth context persistence
      const stored = localStorage.getItem('aharya_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('aharya_user', JSON.stringify({
          ...parsed,
          ...res.data,
          name: res.data.full_name
        }));
      }
      toast.success("Profile details updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile changes.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        padding: '120px 24px 80px',
        maxWidth: '650px',
        margin: '0 auto',
        minHeight: '80vh',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-dark)'
      }}
    >
      <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '2.5rem', marginBottom: '8px' }}>
        My Account
      </h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        View and update your personal credentials and contact details below.
      </p>

      <form onSubmit={handleSave} style={{
        background: 'white',
        border: '1px solid #eee',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Email - Read Only */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', color: '#666' }}>
            Registered Email
          </label>
          <input 
            type="email"
            value={user?.email || ''}
            readOnly
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1.5px solid #eee',
              borderRadius: '8px',
              background: '#fcfcfc',
              color: '#888',
              outline: 'none',
              cursor: 'not-allowed',
              fontSize: '0.95rem'
            }}
          />
        </div>

        {/* Full Name */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', color: '#666' }}>
            Full Name *
          </label>
          <input 
            type="text"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
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

        {/* Phone Number */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', color: '#666' }}>
            Phone Number
          </label>
          <input 
            type="tel"
            placeholder="e.g. +91 98765 43210"
            value={phone}
            onChange={e => setPhone(e.target.value)}
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

        {/* Member Since */}
        <div style={{ fontSize: '0.85rem', color: '#888', paddingTop: '8px' }}>
          Account Created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
        </div>

        {/* Submit */}
        <button 
          type="submit"
          disabled={updating}
          style={{
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
          {updating ? 'Saving Details...' : 'Save Profile Changes'}
        </button>
      </form>
    </motion.div>
  );
}
