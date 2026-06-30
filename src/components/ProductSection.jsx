// ============================================================
// AHARYA – Product Section with Filter & Grid (API-based)
// ============================================================
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import s from './ProductSection.module.css';

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
);
const BagPlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

function ProductCard({ product, searchQuery, onSelectProduct }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const disc = product.originalPrice && product.price 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <motion.div
      className={s.card}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -6 }}
      onClick={() => onSelectProduct?.(product)}
    >
      <div className={s.imgWrap}>
        <img src={product.image || '/assets/saree1.png'} alt={product.name} className={s.img} loading="lazy" />

        {product.badge && <span className={s.badge}>{product.badge}</span>}

        <button
          className={`${s.wishBtn} ${isWishlisted(product.id) ? s.active : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          aria-label="Toggle wishlist"
        >
          <HeartIcon filled={isWishlisted(product.id)} />
        </button>

        <div className={s.overlay}>
          <button className={s.quickViewBtn}>Quick View</button>
        </div>
      </div>

      <div className={s.cardBody}>
        <div className={s.productCategory}>{product.category}</div>
        <div className={s.productName}>{product.name}</div>

        <div className={s.ratingRow}>
          <StarIcon /> {product.rating || '0.0'}
          <span className={s.ratingCount}>({product.reviews || 0} reviews)</span>
        </div>

        {product.colors?.length > 0 && (
          <div className={s.colors}>
            {product.colors.map((c, i) => (
              <div key={i} className={s.colorDot} style={{ background: c }} />
            ))}
          </div>
        )}

        <div className={s.priceRow}>
          <span className={s.price}>₹{product.price?.toLocaleString('en-IN')}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className={s.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
          {disc > 0 && <span className={s.discount}>{disc}% off</span>}
        </div>

        <button
          className={`${s.addCartBtn} ${added ? s.added : ''}`}
          onClick={handleAdd}
          id={`product-cart-btn-${product.id}`}
        >
          {added ? <><CheckIcon /> Added!</> : <><BagPlusIcon /> Add to Cart</>}
        </button>
      </div>
    </motion.div>
  );
}

export default function ProductSection({ searchQuery = '', activeCategory = 'All', setActiveCategory, onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = { page: currentPage };
        if (activeCategory && activeCategory !== 'All') {
          params.category__name = activeCategory;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }

        const [prodRes, catRes] = await Promise.all([
          api.get('/products/', { params }),
          api.get('/products/categories/')
        ]);

        // Map backend product to frontend product format
        const fetchedProducts = (prodRes.data.results || prodRes.data).map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category?.name || 'Uncategorized',
          price: p.discount_price && parseFloat(p.discount_price) > 0 
            ? parseFloat(p.discount_price) 
            : parseFloat(p.price),
          originalPrice: p.discount_price && parseFloat(p.discount_price) > 0 
            ? parseFloat(p.price) 
            : null,
          rating: parseFloat(p.rating) || 0,
          reviews: p.total_reviews || 0,
          image: p.main_image,
          badge: p.is_featured ? 'Featured' : '',
          item_code: p.item_code,
          colors: [] 
        }));

        setProducts(fetchedProducts);

        // Calculate pages based on DRF count field
        const count = prodRes.data.count || fetchedProducts.length;
        setTotalPages(Math.ceil(count / 10) || 1);

        const fetchedCategories = ["All", ...(catRes.data.results || catRes.data).map(c => c.name)];
        setCategories(fetchedCategories);
      } catch (e) {
        console.error("Failed to fetch products or categories", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCategory, searchQuery, currentPage]);

  const filtered = products;

  return (
    <section id="products" className={s.section}>
      <div className="container">
        <motion.div
          className={s.sectionHead}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className={s.eyebrow}>Our Collection</div>
          <h2 className={s.title}>
            Every Drape,<br />A <em>Story</em>
          </h2>
          <p className={s.subtitle}>
            Hand-picked sarees from master weavers across India — timeless, elegant, exclusively yours.
          </p>
        </motion.div>

        {/* Filter */}
        <div className={s.filterBar}>
          {categories.map(cat => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase().replace(' ', '-')}`}
              className={`${s.filterBtn} ${activeCategory === cat ? s.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className={s.grid}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={s.cardSkeleton}>
                  <div className={`${s.skeletonImage} ${s.shimmer}`} />
                  <div className={`${s.skeletonTitle} ${s.shimmer}`} />
                  <div className={`${s.skeletonPrice} ${s.shimmer}`} />
                </div>
              ))}
            </div>
          ) : (
            <motion.div className={s.grid} layout>
              {filtered.length === 0 ? (
                <div className={s.noResults}>
                  <div className={s.noResultsTitle}>No sarees found</div>
                  <div className={s.noResultsSub}>Try a different filter or search term.</div>
                </div>
              ) : (
                filtered.map(product => (
                  <ProductCard key={product.id} product={product} searchQuery={searchQuery} onSelectProduct={onSelectProduct} />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Pagination */}
        {!loading && totalPages > 1 && (
          <div className={s.paginationContainer}>
            <button 
              className={s.pageArrow} 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              ← Prev
            </button>
            
            <div className={s.pageNumbers}>
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    className={`${s.pageNumBtn} ${currentPage === pageNum ? s.activePageNum : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button 
              className={s.pageArrow} 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
