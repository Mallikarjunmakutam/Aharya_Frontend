// ============================================================
// AHARYA – Header Component
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoginModal from './LoginModal';
import s from './Header.module.css';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const BagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export default function Header({ onSearch }) {
  const { user, logout } = useAuth();
  const { cartCount, wishlistItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (showSearch && searchRef.current) searchRef.current.focus();
  }, [showSearch]);

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchVal('');
    onSearch?.('');
  };

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '';

  return (
    <>
      <motion.header
        className={`${s.header} ${scrolled ? s.scrolled : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className={s.headerInner}>
          {/* Logo */}
          <div className={s.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/assets/logo.jpg" alt="Aharya Logo" className={s.logoImg} />
            <div className={s.logoText}>
              <span className={s.logoName}>Āhāryā</span>
              <span className={s.logoTagline}>The Indian Diva's Closet</span>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className={s.centerNav}>
            <button className={s.navLink}>Collections</button>
            <button className={s.navLink}>Wedding</button>
            <button className={s.navLink}>Silk</button>
            <button className={s.navLink}>Designer</button>
          </nav>

          {/* Actions */}
          <div className={s.navActions}>
            <button id="header-search-btn" className={s.iconBtn} onClick={() => setShowSearch(true)} aria-label="Search">
              <SearchIcon />
            </button>

            <button id="header-wishlist-btn" className={s.iconBtn} aria-label="Wishlist">
              <HeartIcon />
              {wishlistItems.length > 0 && <span className={s.badge}>{wishlistItems.length}</span>}
            </button>

            <button id="header-cart-btn" className={s.iconBtn} aria-label="Cart">
              <BagIcon />
              {cartCount > 0 && <span className={s.badge}>{cartCount}</span>}
            </button>

            <div className={s.dividerLine} />

            <button id="header-contact-btn" className={s.contactBtn}>
              <MailIcon />
              <span>Contact</span>
            </button>

            {user ? (
              <div className={s.userMenu} ref={userMenuRef}>
                <button className={s.userBtn} onClick={() => setShowUserMenu(v => !v)}>
                  <div className={s.userAvatar}>{initials}</div>
                  {user.name.split(' ')[0]}
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      className={s.dropdown}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      <button className={s.dropdownItem}>
                        <UserIcon /> My Account
                      </button>
                      <button className={s.dropdownItem}>
                        <BagIcon /> My Orders
                      </button>
                      <div className={s.dropdownDivider} />
                      <button className={s.dropdownItem} onClick={() => { logout(); setShowUserMenu(false); }}>
                        <LogoutIcon /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button id="header-login-btn" className={s.loginBtn} onClick={() => setShowLogin(true)}>
                <UserIcon /> Login
              </button>
            )}

            {/* Mobile Hamburger */}
            <button className={s.hamburgerBtn} onClick={() => setShowMobileMenu(true)} aria-label="Menu">
              <MenuIcon />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className={s.searchOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && handleCloseSearch()}
          >
            <motion.div
              className={s.searchBox}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SearchIcon />
              <input
                ref={searchRef}
                className={s.searchInput}
                placeholder="Search sarees, fabrics, occasions…"
                value={searchVal}
                onChange={handleSearch}
                id="header-search-input"
              />
              <button className={s.searchClose} onClick={handleCloseSearch} aria-label="Close search">
                <CloseIcon />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div 
              className={s.drawerOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              className={s.drawer}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className={s.drawerHeader}>
                <span className={s.drawerTitle}>Menu</span>
                <button className={s.drawerClose} onClick={() => setShowMobileMenu(false)}>
                  <CloseIcon />
                </button>
              </div>
              <nav className={s.drawerNav}>
                <a onClick={() => setShowMobileMenu(false)}>Collections</a>
                <a onClick={() => setShowMobileMenu(false)}>Wedding</a>
                <a onClick={() => setShowMobileMenu(false)}>Silk</a>
                <a onClick={() => setShowMobileMenu(false)}>Designer</a>
                <div className={s.drawerDivider} />
                <a onClick={() => { setShowMobileMenu(false); setShowLogin(true); }}>Login / Signup</a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}

