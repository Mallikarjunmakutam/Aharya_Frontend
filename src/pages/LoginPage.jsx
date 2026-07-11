// ============================================================
// AHARYA – Login & Signup Page
// ============================================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import s from './LoginPage.module.css';

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12,19 5,12 12,5"/>
  </svg>
);

export default function LoginPage() {
  const { user, login, signup, googleLogin } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirectUrl = searchParams.get('redirect') || '/';

  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupMethod, setSignupMethod] = useState(null); // 'email' or null
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // If user is already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      navigate(redirectUrl, { replace: true });
    }
  }, [user, navigate, redirectUrl]);

  const reset = () => { 
    setForm({ name: '', email: '', password: '' }); 
    setError(''); 
    setSuccess(''); 
    setSignupMethod(null);
  };

  const switchTab = (t) => { 
    setTab(t); 
    reset(); 
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (tab === 'login') {
      const res = await login(form.email, form.password);
      if (res.success) {
        setSuccess('Welcome back! Logged in successfully.');
        setTimeout(() => {
          navigate(redirectUrl, { replace: true });
        }, 1000);
      } else {
        setError(res.error);
      }
    } else {
      if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
      const res = await signup(form.name, form.email, form.password);
      if (res.success) {
        setSuccess('Account created! Welcome to Āhāryā.');
        setTimeout(() => {
          navigate(redirectUrl, { replace: true });
        }, 1000);
      } else {
        setError(res.error);
      }
    }
    setLoading(false);
  };

  // Detect and track Google Identity Services library load
  useEffect(() => {
    if (window.google) {
      setGoogleLoaded(true);
      return;
    }
    const interval = setInterval(() => {
      if (window.google) {
        setGoogleLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Initialize and render Google Login button when container is visible
  useEffect(() => {
    if (!googleLoaded) return;

    const handleGoogleAuth = async (response) => {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await googleLogin(response.credential);
      if (res.success) {
        setSuccess('Welcome to Āhāryā! Signed in successfully.');
        setTimeout(() => {
          navigate(redirectUrl, { replace: true });
        }, 1000);
      } else {
        setError(res.error || 'Google authentication failed');
      }
      setLoading(false);
    };

    if (tab === 'signup' && signupMethod === null) {
      const container = document.getElementById('google-signup-btn-container');
      if (container && window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id.apps.googleusercontent.com',
            callback: handleGoogleAuth,
          });
          window.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            text: 'signup_with',
            shape: 'pill',
            width: 376,
          });
        } catch (err) {
          console.error('Failed to render Google Sign-Up button:', err);
        }
      }
    } else if (tab === 'login') {
      const container = document.getElementById('google-login-btn-container');
      if (container && window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id.apps.googleusercontent.com',
            callback: handleGoogleAuth,
          });
          window.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            width: 376,
          });
        } catch (err) {
          console.error('Failed to render Google Sign-In button:', err);
        }
      }
    }
  }, [tab, signupMethod, googleLoaded, googleLogin, navigate, redirectUrl]);

  return (
    <div className={s.container}>
      <motion.div
        className={s.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={s.cardHead}>
          <img src="/assets/logo.jpg" alt="Aharya" className={s.cardLogo} />
          <div className={s.cardTitle}>
            {tab === 'login' ? 'Welcome Back' : 'Join Āhāryā'}
          </div>
          <div className={s.cardSub}>The Indian Diva's Closet</div>
        </div>

        <div className={s.tabs}>
          <button
            id="page-login-tab"
            className={`${s.tabBtn} ${tab === 'login' ? s.active : ''}`}
            onClick={() => switchTab('login')}
          >Login</button>
          <button
            id="page-signup-tab"
            className={`${s.tabBtn} ${tab === 'signup' ? s.active : ''}`}
            onClick={() => switchTab('signup')}
          >Sign Up</button>
        </div>

        {tab === 'signup' && signupMethod === null ? (
          <div className={s.choiceContainer}>
            <div id="google-signup-btn-container" className={s.googleBtnContainer}></div>
            
            <div className={s.divider}>
              <span>or</span>
            </div>
            
            <button
              id="signup-email-btn"
              type="button"
              className={s.emailChoiceBtn}
              onClick={() => setSignupMethod('email')}
            >
              <MailIcon /> Sign up with Email ID
            </button>
            
            {error && <div className={s.error} style={{ marginTop: 'var(--space-4)' }}>{error}</div>}
            {success && <div className={s.success} style={{ marginTop: 'var(--space-4)' }}>{success}</div>}
          </div>
        ) : (
          <form className={s.form} onSubmit={handleSubmit} noValidate>
            {tab === 'login' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '8px' }}>
                <div id="google-login-btn-container" className={s.googleBtnContainer}></div>
                <div className={s.divider} style={{ width: '100%' }}>
                  <span>or</span>
                </div>
              </div>
            )}

            {tab === 'signup' && signupMethod === 'email' && (
              <button
                type="button"
                className={s.backBtn}
                onClick={() => setSignupMethod(null)}
              >
                <ArrowLeftIcon /> Back to options
              </button>
            )}

            {tab === 'signup' && (
              <div className={s.fieldGroup}>
                <label className={s.label} htmlFor="page-name">Your Name</label>
                <input
                  id="page-name"
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
              <label className={s.label} htmlFor="page-email">Email Address</label>
              <input
                id="page-email"
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
              <label className={s.label} htmlFor="page-password">Password</label>
              <input
                id="page-password"
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
              id="page-submit-btn"
              className={s.submitBtn}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        )}

        <p className={s.terms}>
          By continuing, you agree to our{' '}
          <span className={s.goldLink}>Terms</span> &amp;{' '}
          <span className={s.goldLink}>Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
}
