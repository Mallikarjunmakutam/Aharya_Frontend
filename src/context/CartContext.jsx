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
      // CartViewSet returns an array for list(), but get_object() returns single cart.
      // Assuming list returns [cart]
      if (res.data && res.data.length > 0) {
        // Map backend CartItem structure to frontend structure
        const items = res.data[0].items.map(item => ({
          ...item.product,
          qty: item.quantity
        }));
        setCartItems(items);
      }
    } catch (e) {
      console.error('Error fetching cart', e);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/cart/wishlist/');
      if (res.data && res.data.length > 0) {
        setWishlistItems(res.data[0].products);
      }
    } catch (e) {
      console.error('Error fetching wishlist', e);
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      // Fallback for non-logged in (or force login)
      alert("Please login to add to cart");
      return;
    }
    try {
      await api.post('/cart/add-item/', { product_id: product.id, quantity: 1 });
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
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartCount, wishlistItems, toggleWishlist, isWishlisted }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
