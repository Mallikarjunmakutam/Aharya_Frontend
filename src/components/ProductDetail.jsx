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
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detailProduct, setDetailProduct] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);

  const handleAdd = () => {
    addToCart({ ...product, quantity, selectedColor });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const disc = product.originalPrice && product.price 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
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
          setActiveMedia({ type: 'image', url: res.data.main_image || product.image });
        }
      } catch (err) {
        console.error("Failed to fetch product details", err);
        setDetailProduct(null);
        setActiveMedia({ type: 'image', url: product.image });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [product.id]);

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
                  src={activeMedia?.url || product.image} 
                  alt={product.name} 
                  className={s.mainImage} 
                />
              )}
              {product.badge && <span className={s.badge}>{product.badge}</span>}
            </div>
            <div className={s.thumbnailList}>
              {loading ? (
                <img src={product.image} className={s.thumbnailActive} alt="thumb" />
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
            <div className={s.category}>{detailProduct?.category?.name || product.category}</div>
            <h1 className={s.title}>{product.name}</h1>
            
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className={s.itemCodeLabel}>Item Code:</span>
              <span className={s.itemCodeVal} style={{ fontFamily: 'monospace', fontWeight: 'bold', background: 'var(--color-gray-100)', padding: '2px 8px', borderRadius: '4px' }}>
                {detailProduct?.item_code || product.item_code || 'N/A'}
              </span>
            </div>

            <div className={s.ratingRow}>
              <div className={s.stars}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < Math.floor(product.rating) ? 'var(--color-gold)' : '#ddd' }}>
                    <StarIcon />
                  </span>
                ))}
              </div>
              <span className={s.ratingScore}>{product.rating}</span>
              <span className={s.reviewsCount}>({product.reviews} customer reviews)</span>
            </div>

            <div className={s.priceBlock}>
              <span className={s.price}>₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className={s.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className={s.discountTag}>{disc}% OFF</span>
                </>
              )}
            </div>

            <p className={s.description}>
              {detailProduct?.description || product.description || "Elevate your wardrobe with this authentic, hand-woven masterpiece. Crafted with premium threads and traditional techniques, it offers unparalleled grace and comfort for any special occasion."}
            </p>

            <div className={s.divider} />

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className={s.colorSelection}>
                <div className={s.sectionTitle}>Select Color</div>
                <div className={s.colorsList}>
                  {product.colors.map(c => (
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
                className={`${s.wishlistBtn} ${isWishlisted(product.id) ? s.wishlistActive : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                <HeartIcon filled={isWishlisted(product.id)} />
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
