// ============================================================
// AHARYA – Cart & Wishlist Context (API-based)
// ============================================================
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch cart and wishlist on auth change
  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    } else {
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart/');
      const data = res.data.results || res.data;
      if (data && data.length > 0) {
        const items = data[0].items.map(item => {
          const product = item.product;
          const variant = item.variant;
          
          const variantPrice = variant 
            ? (variant.discount_price && parseFloat(variant.discount_price) > 0 ? parseFloat(variant.discount_price) : parseFloat(variant.price)) 
            : null;
          const basePrice = product.discount_price && parseFloat(product.discount_price) > 0 
            ? parseFloat(product.discount_price) 
            : parseFloat(product.price);
          const price = variantPrice !== null && !isNaN(variantPrice) ? variantPrice : basePrice;

          const variantOrig = variant 
            ? (variant.discount_price && parseFloat(variant.discount_price) > 0 ? parseFloat(variant.price) : null)
            : null;
          const baseOrig = product.discount_price && parseFloat(product.discount_price) > 0 
            ? parseFloat(product.price) 
            : null;
          const originalPrice = variantOrig !== null ? variantOrig : baseOrig;

          const varImage = variant?.images?.find(img => img.is_main)?.image || variant?.images?.[0]?.image;
          const image = varImage || product.main_image;

          const item_code = variant?.sku || product.item_code;
          const colorName = variant?.color_name || '';
          
          return {
            id: variant?.id || product.id,
            productId: product.id,
            variantId: variant?.id || null,
            name: product.name + (colorName ? ` - ${colorName}` : ''),
            category: product.category?.name || 'Uncategorized',
            price,
            originalPrice,
            rating: parseFloat(product.rating) || 0,
            reviews: product.total_reviews || 0,
            image,
            badge: product.is_featured ? 'Featured' : '',
            item_code,
            qty: item.quantity
          };
        });
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (e) {
      console.error('Error fetching cart', e);
      setCartItems([]);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/cart/wishlist/');
      const data = res.data.results || res.data;
      if (data && data.length > 0) {
        const products = data[0].products.map(p => ({
          id: p.id,
          name: p.name,
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
        setWishlistItems(products);
      } else {
        setWishlistItems([]);
      }
    } catch (e) {
      console.error('Error fetching wishlist', e);
      setWishlistItems([]);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert("Please login to add to cart");
      return;
    }
    const qty = typeof quantity === 'number' ? quantity : (product.quantity || 1);
    try {
      await api.post('/cart/add-item/', { 
        product_id: product.productId || product.id,
        variant_id: product.variantId || null,
        quantity: qty 
      });
      fetchCart();
    } catch (e) {
      console.error('Error adding to cart', e);
    }
  };

  const removeFromCart = async (id) => {
    if (!user) return;
    try {
      const item = cartItems.find(i => i.id === id);
      const payload = {};
      if (item && item.variantId) {
        payload.variant_id = item.variantId;
      } else {
        payload.product_id = id;
      }
      await api.post('/cart/remove-item/', payload);
      fetchCart();
    } catch (e) {
      console.error('Error removing from cart', e);
    }
  };

  const cartCount = cartItems.reduce((s, i) => s + (i.qty || 1), 0);

  const toggleWishlist = async (product) => {
    if (!user) {
      alert("Please login to add to wishlist");
      return;
    }
    try {
      await api.post('/cart/wishlist/toggle/', { product_id: product.id });
      fetchWishlist();
    } catch (e) {
      console.error('Error toggling wishlist', e);
    }
  };

  const isWishlisted = (id) => wishlistItems.some(i => i.id === id);

  return (
    <CartContext.Provider value={{ cartItems, fetchCart, addToCart, removeFromCart, cartCount, wishlistItems, toggleWishlist, isWishlisted, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
