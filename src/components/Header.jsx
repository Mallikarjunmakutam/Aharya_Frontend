// ============================================================
// AHARYA – Header Component
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
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

export default function Header({ onSearch, setViewMode, activeCategory: activeCategoryProp, setActiveCategory: setActiveCategoryProp, setSelectedProduct }) {
  const { user, logout } = useAuth();
  const { cartItems, cartCount, wishlistItems, removeFromCart, addToCart, toggleWishlist, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'All';
  const searchQueryParam = searchParams.get('search') || '';

  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showWishlistDrawer, setShowWishlistDrawer] = useState(false);
  const [searchVal, setSearchVal] = useState(searchQueryParam);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const headerSearchRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
      if (headerSearchRef.current && !headerSearchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [showSearch]);

  useEffect(() => {
    setSearchVal(searchQueryParam);
  }, [searchQueryParam]);

  // Live search debounced fetch
  useEffect(() => {
    if (!searchVal.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/products/', { params: { search: searchVal.trim(), page_size: 6 } });
        setSearchResults(res.data.results || res.data || []);
      } catch (err) {
        console.error("Live search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchVal]);

  const handleCategoryClick = (category) => {
    if (location.pathname !== '/shop') {
      const params = category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
      navigate(`/shop${params}`);
    } else {
      if (category === 'All') {
        const nextParams = {};
        if (searchQueryParam) nextParams.search = searchQueryParam;
        setSearchParams(nextParams);
      } else {
        const nextParams = { category };
        if (searchQueryParam) nextParams.search = searchQueryParam;
        setSearchParams(nextParams);
      }
    }
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  const handleExecuteSearch = (e) => {
    if (e) e.preventDefault();
    const query = searchVal.trim();
    setShowSearch(false);
    
    const params = {};
    if (query) params.search = query;
    if (activeCategory && activeCategory !== 'All') params.category = activeCategory;
    const queryStr = new URLSearchParams(params).toString();
    navigate(`/shop${queryStr ? `?${queryStr}` : ''}`);
  };

  const handleClearSearchInput = (e) => {
    e?.stopPropagation();
    setSearchVal('');
    setSearchResults([]);
    searchRef.current?.focus();
    if (location.pathname === '/shop') {
      const nextParams = {};
      if (activeCategory && activeCategory !== 'All') nextParams.category = activeCategory;
      setSearchParams(nextParams);
    }
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  const handleSelectSearchResult = (product) => {
    setShowSearch(false);
    navigate(`/product/${product.slug}`);
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
          <div className={s.logo} onClick={handleLogoClick}>
            <img src="/assets/logo.jpg" alt="Aharya Logo" className={s.logoImg} />
            <div className={s.logoText}>
              <span className={s.logoName}>Āhāryā</span>
              <span className={s.logoTagline}>The Indian Diva's Closet</span>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className={s.centerNav}>
          </nav>

          {/* Actions */}
          <div className={s.navActions}>
            <button 
              className={`${s.navLink} ${location.pathname === '/about' ? s.activeLink : ''}`} 
              onClick={() => navigate('/about')}
            >
              About Us
            </button>

            {/* Desktop / Tablet Inline Search Bar */}
            <div className={s.headerSearchWrapper} ref={headerSearchRef}>
              <form onSubmit={handleExecuteSearch} className={s.headerSearchForm}>
                <button type="submit" className={s.headerSearchBtn} aria-label="Search">
                  <SearchIcon />
                </button>
                <input
                  type="text"
                  className={s.headerSearchInput}
                  placeholder="Search sarees, fabrics..."
                  value={searchVal}
                  onChange={(e) => {
                    handleSearchChange(e);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  id="main-header-search-input"
                  autoComplete="off"
                />
                {searchVal && (
                  <button 
                    type="button" 
                    className={s.headerSearchClear} 
                    onClick={handleClearSearchInput}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </form>

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && searchVal.trim() && (
                <div className={s.headerSuggestionsDropdown}>
                  {isSearching ? (
                    <div className={s.headerSearchLoading}>
                      <span className={s.searchSpinner} /> Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className={s.headerResultsList}>
                      {searchResults.map((product) => {
                        const price = product.discount_price && parseFloat(product.discount_price) > 0 
                          ? parseFloat(product.discount_price) 
                          : parseFloat(product.price);
                        return (
                          <div 
                            key={product.id} 
                            className={s.headerResultItem}
                            onClick={() => {
                              setShowSuggestions(false);
                              handleSelectSearchResult(product);
                            }}
                          >
                            <img 
                              src={product.main_image || '/assets/logo.jpg'} 
                              alt={product.name} 
                              className={s.headerResultThumb}
                              onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
                            />
                            <div className={s.headerResultDetails}>
                              <div className={s.headerResultName}>{product.name}</div>
                              <div className={s.headerResultMeta}>
                                <span>{product.category?.name || 'Saree'}</span>
                                {product.fabric && <span>• {product.fabric}</span>}
                              </div>
                            </div>
                            <div className={s.headerResultPrice}>₹{price.toLocaleString('en-IN')}</div>
                          </div>
                        );
                      })}
                      <button 
                        type="button" 
                        className={s.headerViewAllBtn}
                        onClick={(e) => {
                          setShowSuggestions(false);
                          handleExecuteSearch(e);
                        }}
                      >
                        View all results for "{searchVal.trim()}" →
                      </button>
                    </div>
                  ) : (
                    <div className={s.headerNoResults}>
                      No sarees found matching "<strong>{searchVal}</strong>"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Icon Search Button (falls back to overlay on small screens) */}
            <button id="header-search-btn" className={`${s.iconBtn} ${s.mobileSearchBtn}`} onClick={() => setShowSearch(true)} aria-label="Search">
              <SearchIcon />
            </button>

            <button id="header-wishlist-btn" className={s.iconBtn} onClick={() => setShowWishlistDrawer(true)} aria-label="Wishlist">
              <HeartIcon />
              {wishlistItems.length > 0 && <span className={s.badge}>{wishlistItems.length}</span>}
            </button>

            <button id="header-cart-btn" className={s.iconBtn} onClick={() => setIsCartOpen(true)} aria-label="Cart">
              <BagIcon />
              {cartCount > 0 && <span className={s.badge}>{cartCount}</span>}
            </button>

            <div className={s.dividerLine} />

            <button id="header-contact-btn" className={s.contactBtn} onClick={() => navigate('/contact')}>
              <MailIcon />
              <span>Contact Us</span>
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
                      <button className={s.dropdownItem} onClick={() => { navigate('/account'); setShowUserMenu(false); }}>
                        <UserIcon /> My Account
                      </button>
                      <button className={s.dropdownItem} onClick={() => { navigate('/orders'); setShowUserMenu(false); }}>
                        <BagIcon /> My Orders
                      </button>
                      {user?.is_staff && (
                        <button className={s.dropdownItem} onClick={() => { navigate('/superuser'); setShowUserMenu(false); }}>
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
              className={s.searchContainer}
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <form onSubmit={handleExecuteSearch} className={s.searchBox}>
                <button type="submit" className={s.searchSubmitBtn} aria-label="Search">
                  <SearchIcon />
                </button>
                <input
                  ref={searchRef}
                  className={s.searchInput}
                  placeholder="Search by saree name, fabric (Silk, Banarasi), item code..."
                  value={searchVal}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') handleCloseSearch();
                  }}
                  id="header-search-input"
                  autoComplete="off"
                />
                {searchVal && (
                  <button 
                    type="button" 
                    className={s.searchClearBtn} 
                    onClick={handleClearSearchInput}
                    aria-label="Clear input"
                  >
                    ✕
                  </button>
                )}
                <button 
                  type="button" 
                  className={s.searchClose} 
                  onClick={handleCloseSearch} 
                  aria-label="Close search"
                >
                  <CloseIcon />
                </button>
              </form>

              {/* Live Search Suggestions Dropdown */}
              {searchVal.trim() && (
                <div className={s.searchResultsDropdown}>
                  {isSearching ? (
                    <div className={s.searchLoading}>
                      <span className={s.searchSpinner} /> Searching catalogue...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className={s.resultsList}>
                      <div className={s.resultsHeader}>
                        <span>Matching Products ({searchResults.length})</span>
                      </div>
                      {searchResults.map((product) => {
                        const price = product.discount_price && parseFloat(product.discount_price) > 0 
                          ? parseFloat(product.discount_price) 
                          : parseFloat(product.price);
                        const origPrice = product.discount_price && parseFloat(product.discount_price) > 0 
                          ? parseFloat(product.price) 
                          : null;

                        return (
                          <div 
                            key={product.id} 
                            className={s.resultItem}
                            onClick={() => handleSelectSearchResult(product)}
                          >
                            <img 
                              src={product.main_image || '/assets/logo.jpg'} 
                              alt={product.name} 
                              className={s.resultThumb}
                              onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
                            />
                            <div className={s.resultInfo}>
                              <div className={s.resultName}>{product.name}</div>
                              <div className={s.resultMeta}>
                                <span className={s.resultTag}>{product.category?.name || 'Saree'}</span>
                                {product.fabric && <span className={s.resultFabric}>• {product.fabric}</span>}
                                {product.item_code && <span className={s.resultCode}>• {product.item_code}</span>}
                              </div>
                            </div>
                            <div className={s.resultPriceBlock}>
                              <span className={s.resultPrice}>₹{price.toLocaleString('en-IN')}</span>
                              {origPrice && (
                                <span className={s.resultOrigPrice}>₹{origPrice.toLocaleString('en-IN')}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <button 
                        type="button" 
                        className={s.viewAllResultsBtn}
                        onClick={handleExecuteSearch}
                      >
                        View all results for "{searchVal.trim()}" →
                      </button>
                    </div>
                  ) : (
                    <div className={s.noResultsBox}>
                      <p>No sarees found matching "<strong>{searchVal}</strong>"</p>
                      <span>Try searching for fabrics like "Silk", "Banarasi", "Cotton" or item codes</span>
                    </div>
                  )}
                </div>
              )}
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
                <a onClick={() => { setShowMobileMenu(false); navigate('/shop'); }}>Collections</a>
                <a onClick={() => { setShowMobileMenu(false); setShowWishlistDrawer(true); }}>My Wishlist</a>
                <a onClick={() => { setShowMobileMenu(false); navigate('/about'); }}>About Us</a>
                <a onClick={() => { setShowMobileMenu(false); navigate('/blog'); }}>Blog</a>
                <a onClick={() => { setShowMobileMenu(false); navigate('/contact'); }}>Contact Us</a>
                <div className={s.drawerDivider} />
                {user ? (
                  <>
                    <a onClick={() => { setShowMobileMenu(false); navigate('/account'); }}>My Account</a>
                    <a onClick={() => { setShowMobileMenu(false); navigate('/orders'); }}>My Orders</a>
                    {user?.is_staff && (
                      <a onClick={() => { setShowMobileMenu(false); navigate('/superuser'); }}>Superuser Panel</a>
                    )}
                    <div className={s.drawerDivider} />
                    <a onClick={() => { setShowMobileMenu(false); logout(); }}>Sign Out ({user.name || user.full_name || 'User'})</a>
                  </>
                ) : (
                  <a onClick={() => { setShowMobileMenu(false); setShowLogin(true); }}>Login / Signup</a>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              className={s.drawerOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
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
                <button className={s.drawerClose} onClick={() => setIsCartOpen(false)}>
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
                  <button className={s.checkoutBtn} onClick={() => { 
                    setIsCartOpen(false); 
                    if (!user) {
                      navigate('/login?redirect=%2Fcheckout');
                    } else {
                      navigate('/checkout');
                    }
                  }}>
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

