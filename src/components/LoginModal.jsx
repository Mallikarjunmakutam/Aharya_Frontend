// ============================================================
// AHARYA – Login & Signup Modal
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import s from './LoginModal.module.css';

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function LoginModal({ isOpen, onClose }) {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => { setForm({ name: '', email: '', password: '' }); setError(''); setSuccess(''); };

  const switchTab = (t) => { setTab(t); reset(); };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    await new Promise(r => setTimeout(r, 600)); // fake async

    if (tab === 'login') {
      const res = login(form.email, form.password);
      if (res.success) {
        setSuccess('Welcome back! Logged in successfully.');
        setTimeout(onClose, 1200);
      } else {
        setError(res.error);
      }
    } else {
      if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
      const res = signup(form.name, form.email, form.password);
      if (res.success) {
        setSuccess('Account created! Welcome to Āhāryā.');
        setTimeout(onClose, 1200);
      } else {
        setError(res.error);
      }
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={s.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className={s.modal}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <button className={s.closeBtn} onClick={onClose} aria-label="Close modal">
              <CloseIcon />
            </button>

            <div className={s.modalHead}>
              <img src="/assets/logo.jpg" alt="Aharya" className={s.modalLogo} />
              <div className={s.modalTitle}>
                {tab === 'login' ? 'Welcome Back' : 'Join Āhāryā'}
              </div>
              <div className={s.modalSub}>The Indian Diva's Closet</div>
            </div>

            <div className={s.tabs}>
              <button
                id="modal-login-tab"
                className={`${s.tabBtn} ${tab === 'login' ? s.active : ''}`}
                onClick={() => switchTab('login')}
              >Login</button>
              <button
                id="modal-signup-tab"
                className={`${s.tabBtn} ${tab === 'signup' ? s.active : ''}`}
                onClick={() => switchTab('signup')}
              >Sign Up</button>
            </div>

            <form className={s.form} onSubmit={handleSubmit} noValidate>
              {tab === 'signup' && (
                <div className={s.fieldGroup}>
                  <label className={s.label} htmlFor="modal-name">Your Name</label>
                  <input
                    id="modal-name"
                    className={s.input}
                    type="text"
                    name="name"
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              )}

              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor="modal-email">Email Address</label>
                <input
                  id="modal-email"
                  className={s.input}
                  type="email"
                  name="email"
                  placeholder="hello@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor="modal-password">Password</label>
                <input
                  id="modal-password"
                  className={s.input}
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  required
                />
              </div>

              {error && <div className={s.error}>{error}</div>}
              {success && <div className={s.success}>{success}</div>}

              <button
                id="modal-submit-btn"
                className={s.submitBtn}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className={s.terms}>
              By continuing, you agree to our{' '}
              <span className={s.goldLink}>Terms</span> &amp;{' '}
              <span className={s.goldLink}>Privacy Policy</span>.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

