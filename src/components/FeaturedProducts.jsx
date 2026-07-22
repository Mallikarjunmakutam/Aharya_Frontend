// ============================================================
// AHARYA – Featured Products Component
// ============================================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import s from './FeaturedProducts.module.css';

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

function FeaturedCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.stopPropagation();
    
    // Map to expected CartItem fields
    const cartProduct = {
      id: product.id,
      productId: product.id,
      variantId: product.variants?.[0]?.id || null,
      name: product.name,
      category: product.category?.name || 'Uncategorized',
      price: product.discount_price && parseFloat(product.discount_price) > 0 
        ? parseFloat(product.discount_price) 
        : parseFloat(product.price),
      originalPrice: product.discount_price && parseFloat(product.discount_price) > 0 
        ? parseFloat(product.price) 
        : null,
      image: product.variants?.[0]?.images?.[0]?.image || product.main_image || '',
      item_code: product.item_code
    };

    addToCart(cartProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const disc = product.price && product.discount_price 
    ? Math.round((1 - parseFloat(product.discount_price) / parseFloat(product.price)) * 100) 
    : 0;

  const displayPrice = product.discount_price && parseFloat(product.discount_price) > 0 
    ? parseFloat(product.discount_price) 
    : parseFloat(product.price);

  const displayOriginalPrice = product.discount_price && parseFloat(product.discount_price) > 0 
    ? parseFloat(product.price) 
    : null;

  return (
    <motion.div
      className={s.card}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      <div className={s.imgWrap}>
        <img src={product.main_image || '/assets/saree1.png'} alt={product.name} className={s.img} loading="lazy" />
        <span className={s.badge}>Featured</span>

        <button
          className={`${s.wishBtn} ${isWishlisted(product.id) ? s.active : ''}`}
          onClick={(e) => { 
            e.stopPropagation(); 
            // map product format for wishlist
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: displayPrice,
              originalPrice: displayOriginalPrice,
              image: product.main_image
            }); 
          }}
          aria-label="Toggle wishlist"
        >
          <HeartIcon filled={isWishlisted(product.id)} />
        </button>
      </div>

      <div className={s.cardBody}>
        <div className={s.productCategory}>{product.category?.name || 'Uncategorized'}</div>
        <div className={s.productName}>{product.name}</div>

        <div className={s.ratingRow}>
          <StarIcon /> {parseFloat(product.rating) || '0.0'}
          <span className={s.ratingCount}>({product.total_reviews || 0} reviews)</span>
        </div>

        <div className={s.priceRow}>
          <span className={s.price}>₹{displayPrice.toLocaleString('en-IN')}</span>
          {displayOriginalPrice && (
            <span className={s.originalPrice}>₹{displayOriginalPrice.toLocaleString('en-IN')}</span>
          )}
          {disc > 0 && <span className={s.discount}>{disc}% off</span>}
        </div>

        <button
          className={`${s.addCartBtn} ${added ? s.added : ''}`}
          onClick={handleAdd}
        >
          {added ? <><CheckIcon /> Added!</> : <><BagPlusIcon /> Add to Cart</>}
        </button>
      </div>
    </motion.div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products/featured/');
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className={s.section}>
      <div className="container">
        <motion.div
          className={s.sectionHead}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className={s.eyebrow}>Curated Masterpieces</div>
          <h2 className={s.title}>Featured Collections</h2>
          <p className={s.subtitle}>
            Explore our most sought-after signature drapes, handpicked for their unique weaves, vibrant tones, and premium fabrics.
          </p>
        </motion.div>

        {loading ? (
          <div className={s.grid}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={s.cardSkeleton}>
                <div className={`${s.skeletonImage} ${s.shimmer}`} />
                <div className={`${s.skeletonTitle} ${s.shimmer}`} />
                <div className={`${s.skeletonPrice} ${s.shimmer}`} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={s.grid}>
              {products.map(product => (
                <FeaturedCard key={product.id} product={product} />
              ))}
            </div>

            <div className={s.btnWrapper}>
              <button className={s.exploreBtn} onClick={() => navigate('/shop')}>
                Explore Full Catalog
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
