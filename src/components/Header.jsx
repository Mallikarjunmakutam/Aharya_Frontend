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

export default function Header({ onSearch, setViewMode, activeCategory, setActiveCategory, setSelectedProduct }) {
  const { user, logout } = useAuth();
  const { cartItems, cartCount, wishlistItems, removeFromCart, addToCart, toggleWishlist } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showWishlistDrawer, setShowWishlistDrawer] = useState(false);
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
    setSelectedProduct?.(null); // Clear selected product details on typing search
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
            <button 
              className={`${s.navLink} ${activeCategory === 'All' ? s.activeLink : ''}`} 
              onClick={() => { setActiveCategory('All'); setSelectedProduct?.(null); }}
            >
              Collections
            </button>
            <button 
              className={`${s.navLink} ${activeCategory === 'Wedding' ? s.activeLink : ''}`} 
              onClick={() => { setActiveCategory('Wedding'); setSelectedProduct?.(null); }}
            >
              Wedding
            </button>
            <button 
              className={`${s.navLink} ${activeCategory === 'Silk' ? s.activeLink : ''}`} 
              onClick={() => { setActiveCategory('Silk'); setSelectedProduct?.(null); }}
            >
              Silk
            </button>
            <button 
              className={`${s.navLink} ${activeCategory === 'Designer' ? s.activeLink : ''}`} 
              onClick={() => { setActiveCategory('Designer'); setSelectedProduct?.(null); }}
            >
              Designer
            </button>
          </nav>

          {/* Actions */}
          <div className={s.navActions}>
            <button id="header-search-btn" className={s.iconBtn} onClick={() => { setShowSearch(true); setSelectedProduct?.(null); }} aria-label="Search">
              <SearchIcon />
            </button>

            <button id="header-wishlist-btn" className={s.iconBtn} onClick={() => setShowWishlistDrawer(true)} aria-label="Wishlist">
              <HeartIcon />
              {wishlistItems.length > 0 && <span className={s.badge}>{wishlistItems.length}</span>}
            </button>

            <button id="header-cart-btn" className={s.iconBtn} onClick={() => setShowCartDrawer(true)} aria-label="Cart">
              <BagIcon />
              {cartCount > 0 && <span className={s.badge}>{cartCount}</span>}
            </button>

            <div className={s.dividerLine} />

            <button id="header-contact-btn" className={s.contactBtn} onClick={() => window.location.href = 'mailto:aharyastore@gmail.com'}>
              <MailIcon />
              <span>Contact</span>
            </button>

            {user ? (
              <div className={s.userMenu} ref={userMenuRef}>
                <button className={s.userBtn} onClick={() => setShowUserMenu(v => !v)}>
                  <div className={s.userAvatar}>{initials}</div>
                  {(user.name || user.full_name || 'User').split(' ')[0]}
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
                      {user?.is_staff && (
                        <button className={s.dropdownItem} onClick={() => { setViewMode('superuser'); setShowUserMenu(false); }}>
                          <UserIcon /> Superuser Panel
                        </button>
                      )}
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
                <a onClick={() => { setShowMobileMenu(false); setActiveCategory('All'); setSelectedProduct?.(null); }}>Collections</a>
                <a onClick={() => { setShowMobileMenu(false); setActiveCategory('Wedding'); setSelectedProduct?.(null); }}>Wedding</a>
                <a onClick={() => { setShowMobileMenu(false); setActiveCategory('Silk'); setSelectedProduct?.(null); }}>Silk</a>
                <a onClick={() => { setShowMobileMenu(false); setActiveCategory('Designer'); setSelectedProduct?.(null); }}>Designer</a>
                <div className={s.drawerDivider} />
                <a onClick={() => { setShowMobileMenu(false); setShowLogin(true); }}>Login / Signup</a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCartDrawer && (
          <>
            <motion.div 
              className={s.drawerOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCartDrawer(false)}
            />
            <motion.div
              className={s.drawer}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className={s.drawerHeader}>
                <span className={s.drawerTitle}>Shopping Cart</span>
                <button className={s.drawerClose} onClick={() => setShowCartDrawer(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className={s.drawerBody}>
                {cartItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-gray-400)' }}>
                    Your cart is empty.
                  </div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div className={s.cartItemRow} key={item.id || idx}>
                      <img src={item.image || '/assets/placeholder.jpg'} alt="" className={s.cartItemThumb} onError={(e) => { e.target.src='/assets/logo.jpg' }} />
                      <div className={s.cartItemDetails}>
                        <span className={s.cartItemName}>{item.name}</span>
                        <span className={s.cartItemPrice}>
                          {item.qty || 1} x ₹{parseFloat(item.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button className={s.cartItemRemove} onClick={() => removeFromCart(item.id)} title="Remove Item">
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
              {cartItems.length > 0 && (
                <div className={s.drawerFooter}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-dark)' }}>
                    <span>Total Amount:</span>
                    <span>₹{cartItems.reduce((acc, item) => acc + (item.qty || 1) * parseFloat(item.price), 0).toLocaleString('en-IN')}</span>
                  </div>
                  <button className={s.checkoutBtn} onClick={() => alert("Proceeding to secure checkout payment portal...")}>
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Wishlist Drawer */}
      <AnimatePresence>
        {showWishlistDrawer && (
          <>
            <motion.div 
              className={s.drawerOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWishlistDrawer(false)}
            />
            <motion.div
              className={s.drawer}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className={s.drawerHeader}>
                <span className={s.drawerTitle}>My Wishlist</span>
                <button className={s.drawerClose} onClick={() => setShowWishlistDrawer(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className={s.drawerBody}>
                {wishlistItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-gray-400)' }}>
                    Your wishlist is empty.
                  </div>
                ) : (
                  wishlistItems.map((item, idx) => (
                    <div className={s.cartItemRow} key={item.id || idx}>
                      <img src={item.image || '/assets/placeholder.jpg'} alt="" className={s.cartItemThumb} onError={(e) => { e.target.src='/assets/logo.jpg' }} />
                      <div className={s.cartItemDetails}>
                        <span className={s.cartItemName}>{item.name}</span>
                        <span className={s.cartItemPrice}>
                          ₹{parseFloat(item.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <button 
                          className={s.checkoutBtn} 
                          style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                          onClick={() => { addToCart(item); toggleWishlist(item); }}
                        >
                          Add
                        </button>
                        <button className={s.cartItemRemove} onClick={() => toggleWishlist(item)} title="Remove Item">
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

