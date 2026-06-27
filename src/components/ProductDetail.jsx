import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import s from './ProductDetail.module.css';

const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);
const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/>
  </svg>
);

export default function ProductDetail({ product, onBack }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detailProduct, setDetailProduct] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);

  const p = detailProduct ? {
    id: detailProduct.id,
    name: detailProduct.name,
    category: detailProduct.category?.name || 'Uncategorized',
    price: parseFloat(detailProduct.discount_price || detailProduct.price),
    originalPrice: detailProduct.discount_price ? parseFloat(detailProduct.price) : null,
    rating: parseFloat(detailProduct.rating) || 0,
    reviews: detailProduct.total_reviews || 0,
    image: detailProduct.main_image,
    badge: detailProduct.is_featured ? 'Featured' : '',
    description: detailProduct.description,
    colors: [],
    item_code: detailProduct.item_code,
  } : {
    id: product?.id,
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || 0,
    originalPrice: product?.originalPrice || null,
    rating: product?.rating || 0,
    reviews: product?.reviews || 0,
    image: product?.image || '',
    badge: product?.badge || '',
    description: product?.description || '',
    colors: product?.colors || [],
    item_code: product?.item_code || '',
  };

  const [selectedColor, setSelectedColor] = useState(p.colors?.[0] || null);

  useEffect(() => {
    if (p.colors?.length > 0 && !selectedColor) {
      setSelectedColor(p.colors[0]);
    }
  }, [p.colors, selectedColor]);

  const handleAdd = () => {
    addToCart({ ...p, quantity, selectedColor });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const disc = p.originalPrice && p.price 
    ? Math.round((1 - p.price / p.originalPrice) * 100) 
    : 0;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${product.id}/`);
        setDetailProduct(res.data);
        const mainImgObj = res.data.images?.find(img => img.is_main) || res.data.images?.[0];
        if (mainImgObj) {
          setActiveMedia({ type: 'image', url: mainImgObj.image });
        } else {
          setActiveMedia({ type: 'image', url: res.data.main_image || product?.image });
        }
      } catch (err) {
        console.error("Failed to fetch product details", err);
        setDetailProduct(null);
        setActiveMedia({ type: 'image', url: product?.image });
      } finally {
        setLoading(false);
      }
    };
    if (product?.id) {
      fetchDetail();
    }
    window.scrollTo(0, 0);
  }, [product?.id]);

  if (loading && !p.name) {
    return (
      <div className={s.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--color-gold)', fontFamily: 'var(--font-heading)' }}>Loading product details...</div>
      </div>
    );
  }

  return (
    <motion.div 
      className={s.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <button onClick={onBack} className={s.backBtn}>
          <ArrowLeft /> Back to products
        </button>

        <div className={s.content}>
          {/* Left: Images */}
          <div className={s.imageSection}>
            <div className={s.mainImageWrap}>
              {activeMedia?.type === 'video' ? (
                <video 
                  src={activeMedia.url} 
                  className={s.mainImage} 
                  controls 
                  autoPlay 
                  playsInline 
                />
              ) : (
                <img 
                  src={activeMedia?.url || p.image} 
                  alt={p.name} 
                  className={s.mainImage} 
                />
              )}
              {p.badge && <span className={s.badge}>{p.badge}</span>}
            </div>
            <div className={s.thumbnailList}>
              {loading ? (
                <img src={p.image} className={s.thumbnailActive} alt="thumb" />
              ) : (
                <>
                  {detailProduct?.images?.map((img, idx) => (
                    <img 
                      key={img.id || idx}
                      src={img.image} 
                      className={activeMedia?.url === img.image ? s.thumbnailActive : s.thumbnail} 
                      alt="thumb" 
                      onClick={() => setActiveMedia({ type: 'image', url: img.image })}
                    />
                  ))}
                  {detailProduct?.video && (
                    <div 
                      className={`${s.videoThumbWrap} ${activeMedia?.url === detailProduct.video ? s.thumbnailActive : s.thumbnail}`}
                      onClick={() => setActiveMedia({ type: 'video', url: detailProduct.video })}
                    >
                      <video src={detailProduct.video} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div className={s.playOverlay}>▶</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className={s.detailsSection}>
            <div className={s.category}>{detailProduct?.category?.name || p.category}</div>
            <h1 className={s.title}>{p.name}</h1>
            
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className={s.itemCodeLabel}>Item Code:</span>
              <span className={s.itemCodeVal} style={{ fontFamily: 'monospace', fontWeight: 'bold', background: 'var(--color-gray-100)', padding: '2px 8px', borderRadius: '4px' }}>
                {detailProduct?.item_code || p.item_code || 'N/A'}
              </span>
            </div>

            <div className={s.ratingRow}>
              <div className={s.stars}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < Math.floor(p.rating) ? 'var(--color-gold)' : '#ddd' }}>
                    <StarIcon />
                  </span>
                ))}
              </div>
              <span className={s.ratingScore}>{p.rating}</span>
              <span className={s.reviewsCount}>({p.reviews} customer reviews)</span>
            </div>

            <div className={s.priceBlock}>
              <span className={s.price}>₹{p.price.toLocaleString('en-IN')}</span>
              {p.originalPrice && p.originalPrice > p.price && (
                <>
                  <span className={s.originalPrice}>₹{p.originalPrice.toLocaleString('en-IN')}</span>
                  <span className={s.discountTag}>{disc}% OFF</span>
                </>
              )}
            </div>

            <p className={s.description}>
              {detailProduct?.description || p.description || "Elevate your wardrobe with this authentic, hand-woven masterpiece. Crafted with premium threads and traditional techniques, it offers unparalleled grace and comfort for any special occasion."}
            </p>

            <div className={s.divider} />

            {/* Colors */}
            {p.colors?.length > 0 && (
              <div className={s.colorSelection}>
                <div className={s.sectionTitle}>Select Color</div>
                <div className={s.colorsList}>
                  {p.colors.map(c => (
                    <button
                      key={c}
                      className={`${s.colorBtn} ${selectedColor === c ? s.colorActive : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setSelectedColor(c)}
                      aria-label="Select color"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className={s.quantitySection}>
              <div className={s.sectionTitle}>Quantity</div>
              <div className={s.qtyControl}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className={s.actionBar}>
              <button 
                className={`${s.addCartBtn} ${added ? s.addedBtn : ''}`} 
                onClick={handleAdd}
              >
                {added ? <><CheckIcon /> Added to Cart</> : 'Add to Cart'}
              </button>
              
              <button 
                className={`${s.wishlistBtn} ${isWishlisted(p.id) ? s.wishlistActive : ''}`}
                onClick={() => toggleWishlist(p)}
              >
                <HeartIcon filled={isWishlisted(p.id)} />
              </button>
            </div>
            
            {/* Delivery Details */}
            <div className={s.deliveryInfo}>
              <div className={s.deliveryItem}>
                <span className={s.deliveryIcon}>🚚</span>
                <div>
                  <strong>Free Delivery</strong>
                  <p>Enter your postal code for delivery availability</p>
                </div>
              </div>
              <div className={s.deliveryItem}>
                <span className={s.deliveryIcon}>🔄</span>
                <div>
                  <strong>Return Delivery</strong>
                  <p>Free 30 Days Delivery Returns. Details</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
