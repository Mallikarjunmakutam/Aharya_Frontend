import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
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
  const { addToCart, toggleWishlist, isWishlisted, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detailProduct, setDetailProduct] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Review states
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState(user?.full_name || '');
  const [reviewComment, setReviewComment] = useState('');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      toast.error("Please fill in all review fields.");
      return;
    }

    try {
      await api.post('/products/reviews/', {
        product: detailProduct?.id || product.id,
        user_name: reviewerName,
        rating: newRating,
        comment: reviewComment
      });

      toast.success("Review submitted successfully!");
      setReviewComment('');
      
      // Refetch details
      const res = await api.get(`/products/${product.id}/`);
      setDetailProduct(res.data);
    } catch (err) {
      toast.error("Failed to submit review.");
    }
  };

  const p = detailProduct ? {
    id: detailProduct.id,
    name: detailProduct.name,
    category: detailProduct.category?.name || 'Uncategorized',
    price: detailProduct.discount_price && parseFloat(detailProduct.discount_price) > 0 
      ? parseFloat(detailProduct.discount_price) 
      : parseFloat(detailProduct.price),
    originalPrice: detailProduct.discount_price && parseFloat(detailProduct.discount_price) > 0 
      ? parseFloat(detailProduct.price) 
      : null,
    rating: parseFloat(detailProduct.rating) || 0,
    reviews: detailProduct.total_reviews || 0,
    image: detailProduct.images?.find(img => img.is_main)?.image || detailProduct.images?.[0]?.image || '',
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
    addToCart(p, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    if (!user) {
      const target = encodeURIComponent(`/checkout?buynow=true&product_id=${p.id}&qty=${quantity}`);
      navigate(`/login?redirect=${target}`);
      return;
    }
    navigate(`/checkout?buynow=true&product_id=${p.id}&qty=${quantity}`);
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

        // Fetch related products from same category
        const catName = res.data.category?.name;
        if (catName) {
          try {
            const relRes = await api.get('/products/', {
              params: { category__name: catName }
            });
            const relList = (relRes.data.results || relRes.data)
              .filter(item => item.id !== res.data.id)
              .slice(0, 4)
              .map(item => ({
                id: item.id,
                name: item.name,
                slug: item.slug,
                category: item.category?.name || 'Uncategorized',
                price: item.discount_price && parseFloat(item.discount_price) > 0 
                  ? parseFloat(item.discount_price) 
                  : parseFloat(item.price),
                image: item.images?.find(img => img.is_main)?.image || item.images?.[0]?.image || item.main_image || ''
              }));
            setRelatedProducts(relList);
          } catch (relErr) {
            console.error("Failed to fetch related products", relErr);
          }
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

  // Track recently viewed products in local storage
  useEffect(() => {
    if (detailProduct) {
      const stored = localStorage.getItem('aharya_recently_viewed');
      let list = stored ? JSON.parse(stored) : [];
      
      list = list.filter(item => item.id !== detailProduct.id);
      list.unshift({
        id: detailProduct.id,
        name: detailProduct.name,
        slug: detailProduct.slug,
        price: detailProduct.discount_price && parseFloat(detailProduct.discount_price) > 0 
          ? parseFloat(detailProduct.discount_price) 
          : parseFloat(detailProduct.price),
        image: detailProduct.images?.find(img => img.is_main)?.image || detailProduct.images?.[0]?.image || '',
        category: detailProduct.category?.name || 'Uncategorized'
      });

      if (list.length > 5) {
        list = list.slice(0, 5);
      }
      localStorage.setItem('aharya_recently_viewed', JSON.stringify(list));
      
      // Update local state for display (excluding current product)
      setRecentlyViewed(list.filter(item => item.id !== detailProduct.id).slice(0, 4));
    }
  }, [detailProduct]);

  if (loading && !detailProduct) {
    return (
      <div className={s.detailSkeleton}>
        <div className={`${s.skeletonLeft} ${s.shimmer}`} />
        <div className={s.skeletonRight}>
          <div className={`${s.skeletonTitle} ${s.shimmer}`} />
          <div className={`${s.skeletonLine} ${s.shimmer}`} style={{ width: '30%' }} />
          <div className={`${s.skeletonLine} ${s.shimmer}`} style={{ width: '45%' }} />
          <div className={`${s.skeletonLine} ${s.shimmer}`} style={{ width: '80%', height: '100px', marginTop: '30px' }} />
          <div className={`${s.skeletonLine} ${s.shimmer}`} style={{ width: '60%', height: '50px', marginTop: '40px', borderRadius: '30px' }} />
        </div>
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
            <div className={s.mainImageWrap} style={{ position: 'relative', overflow: 'hidden' }}>
              <img 
                src="/assets/logo.jpg" 
                alt="Aharya Logo" 
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  zIndex: 10,
                  objectFit: 'cover'
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              <AnimatePresence mode="wait">
                {activeMedia?.type === 'video' ? (
                  <motion.video 
                    key={activeMedia.url}
                    src={activeMedia.url} 
                    className={s.mainImage} 
                    controls 
                    autoPlay 
                    playsInline 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  />
                ) : (
                  <motion.img 
                    key={activeMedia?.url || p.image}
                    src={activeMedia?.url || p.image} 
                    alt={p.name} 
                    className={s.mainImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  />
                )}
              </AnimatePresence>

              {p.badge && (
                <span className={s.badge} style={{ left: 'auto', right: '16px', top: '16px' }}>
                  {p.badge}
                </span>
              )}
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
                className={s.buyNowBtn} 
                onClick={handleBuyNow}
              >
                Buy Now
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

        {/* Ratings and Reviews Section */}
        <div style={{ marginTop: '80px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '2rem', marginBottom: '24px' }}>
            Customer Reviews
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'start' }}>
            {/* Reviews List */}
            <div>
              {(!detailProduct?.reviews || detailProduct.reviews.length === 0) ? (
                <div style={{ color: '#888', fontStyle: 'italic', padding: '20px 0' }}>
                  No reviews yet for this product. Be the first to review!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {detailProduct.reviews.map(rev => (
                    <div key={rev.id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <strong>{rev.user_name}</strong>
                        <span style={{ color: 'var(--color-gold)', fontSize: '0.85rem' }}>
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                        </span>
                      </div>
                      <p style={{ color: '#555', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>{rev.comment}</p>
                      <span style={{ fontSize: '0.78rem', color: '#aaa' }}>{new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

             {/* Review Form */}
             <div style={{ background: '#fbfbf9', padding: '30px', borderRadius: '12px', border: '1px solid #f0f0f0', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
               <h3 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.35rem', marginBottom: '20px' }}>
                 Write a Review
               </h3>
               
               {!user ? (
                 <div style={{ textAlign: 'center', padding: '20px 0' }}>
                   <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.95rem' }}>
                     You must be signed in to leave a product review.
                   </p>
                   <button 
                     onClick={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)}
                     style={{ 
                       padding: '10px 24px', 
                       borderRadius: '30px', 
                       background: 'black', 
                       color: 'white', 
                       border: 'none', 
                       fontWeight: '600', 
                       textTransform: 'uppercase', 
                       cursor: 'pointer' 
                     }}
                   >
                     Sign In
                   </button>
                 </div>
               ) : !detailProduct?.has_purchased ? (
                 <div style={{ textAlign: 'center', padding: '20px 0' }}>
                   <p style={{ color: 'var(--color-gold)', fontWeight: '600', marginBottom: '10px', fontSize: '1.1rem' }}>
                     Purchase Required
                   </p>
                   <p style={{ color: '#666', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                     Only customer accounts with a verified purchase of this saree can write a review.
                   </p>
                 </div>
               ) : (
                 <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>
                       Rating *
                     </label>
                     <div style={{ display: 'flex', gap: '8px' }}>
                       {[1, 2, 3, 4, 5].map(star => (
                         <span 
                           key={star} 
                           onClick={() => setNewRating(star)}
                           style={{ 
                             fontSize: '1.5rem', 
                             cursor: 'pointer', 
                             color: star <= newRating ? 'var(--color-gold)' : '#ccc' 
                           }}
                         >
                           ★
                         </span>
                       ))}
                     </div>
                   </div>

                   <div>
                     <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>
                       Your Name *
                     </label>
                     <input 
                       type="text" 
                       required 
                       value={reviewerName}
                       onChange={e => setReviewerName(e.target.value)}
                       style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', outline: 'none' }}
                     />
                   </div>

                   <div>
                     <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>
                       Comments *
                     </label>
                     <textarea 
                       required 
                       rows="3"
                       value={reviewComment}
                       onChange={e => setReviewComment(e.target.value)}
                       style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', outline: 'none', resize: 'none' }}
                     />
                   </div>

                   <button 
                     type="submit" 
                     style={{ 
                       padding: '12px', 
                       borderRadius: '30px', 
                       background: 'black', 
                       color: 'white', 
                       border: 'none', 
                       fontWeight: '600', 
                       textTransform: 'uppercase', 
                       cursor: 'pointer' 
                     }}
                   >
                     Submit Review
                   </button>
                 </form>
               )}
             </div>
          </div>
        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className={s.carouselSection}>
          <h2 className={s.carouselTitle}>You May Also Like</h2>
          <div className={s.productGrid}>
            {relatedProducts.map(item => (
              <div 
                key={item.id} 
                className={s.productCard}
                onClick={() => navigate(`/product/${item.slug}`)}
              >
                <div className={s.cardImageWrap}>
                  <img src={item.image} alt={item.name} className={s.cardImage} onError={(e) => { e.target.src = '/assets/logo.jpg'; }} />
                </div>
                <div className={s.cardInfo}>
                  <span className={s.cardCategory}>{item.category}</span>
                  <h3 className={s.cardName}>{item.name}</h3>
                  <span className={s.cardPrice}>₹{item.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <div className={s.carouselSection} style={{ marginTop: '60px' }}>
          <h2 className={s.carouselTitle}>Recently Viewed</h2>
          <div className={s.productGrid}>
            {recentlyViewed.map(item => (
              <div 
                key={item.id} 
                className={s.productCard}
                onClick={() => navigate(`/product/${item.slug}`)}
              >
                <div className={s.cardImageWrap}>
                  <img src={item.image} alt={item.name} className={s.cardImage} onError={(e) => { e.target.src = '/assets/logo.jpg'; }} />
                </div>
                <div className={s.cardInfo}>
                  <span className={s.cardCategory}>{item.category}</span>
                  <h3 className={s.cardName}>{item.name}</h3>
                  <span className={s.cardPrice}>₹{item.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </motion.div>
  );
}
