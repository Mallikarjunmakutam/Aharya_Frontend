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
        // Map backend CartItem structure to frontend structure
        const items = data[0].items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          category: item.product.category?.name || 'Uncategorized',
          price: parseFloat(item.product.discount_price || item.product.price),
          originalPrice: item.product.discount_price ? parseFloat(item.product.price) : null,
          rating: parseFloat(item.product.rating) || 0,
          reviews: item.product.total_reviews || 0,
          image: item.product.main_image,
          badge: item.product.is_featured ? 'Featured' : '',
          item_code: item.product.item_code,
          qty: item.quantity
        }));
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
          price: parseFloat(p.discount_price || p.price),
          originalPrice: p.discount_price ? parseFloat(p.price) : null,
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
      // Fallback for non-logged in (or force login)
      alert("Please login to add to cart");
      return;
    }
    const qty = typeof quantity === 'number' ? quantity : (product.quantity || 1);
    try {
      await api.post('/cart/add-item/', { product_id: product.id, quantity: qty });
      fetchCart();
    } catch (e) {
      console.error('Error adding to cart', e);
    }
  };

  const removeFromCart = async (id) => {
    if (!user) return;
    try {
      await api.post('/cart/remove-item/', { product_id: id });
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
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartCount, wishlistItems, toggleWishlist, isWishlisted, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
