import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import api from '../services/api';

export default function Checkout() {
  const { cartItems, fetchCart, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isBuyNow = searchParams.get('buynow') === 'true';
  const buyNowProductId = searchParams.get('product_id');

  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [loading, setLoading] = useState(isBuyNow);

  const [shipping, setShipping] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'Online'
  const [placing, setPlacing] = useState(false);

  // Fetch Buy Now product details directly
  useEffect(() => {
    if (isBuyNow && buyNowProductId) {
      setLoading(true);
      api.get(`/products/${buyNowProductId}/`)
        .then(res => {
          const p = res.data;
          const parsedProduct = {
            id: p.id,
            name: p.name,
            price: p.discount_price && parseFloat(p.discount_price) > 0 
              ? parseFloat(p.discount_price) 
              : parseFloat(p.price),
            originalPrice: p.discount_price && parseFloat(p.discount_price) > 0 
              ? parseFloat(p.price) 
              : null,
            image: p.images?.find(img => img.is_main)?.image || p.images?.[0]?.image || '',
            qty: parseInt(searchParams.get('qty') || 1)
          };
          setBuyNowProduct(parsedProduct);
        })
        .catch(err => {
          console.error("Failed to load Buy Now product details", err);
          toast.error("Failed to load product details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isBuyNow, buyNowProductId, searchParams]);

  // If BuyNow checkout, show only the fetched product. Otherwise show all cart items.
  const displayItems = isBuyNow 
    ? (buyNowProduct ? [buyNowProduct] : [])
    : cartItems;

  const totalAmount = displayItems.reduce((sum, item) => sum + (item.qty || 1) * parseFloat(item.price), 0);

  // Force close the cart drawer when checkout page mounts
  useEffect(() => {
    setIsCartOpen(false);
  }, [setIsCartOpen]);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    toast.info("Checkout cancelled.");
    navigate(-1);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.phone || !shipping.address || !shipping.city || !shipping.state || !shipping.postalCode) {
      toast.error("Please fill in all shipping details.");
      return;
    }

    setPlacing(true);
    try {
      const orderPayload = {
        shipping_info: {
          full_name: shipping.fullName,
          phone: shipping.phone,
          address: shipping.address,
          city: shipping.city,
          state: shipping.state,
          postal_code: shipping.postalCode
        },
        payment_method: paymentMethod
      };

      if (isBuyNow && buyNowProductId) {
        orderPayload.buy_now_product_id = buyNowProductId;
        orderPayload.buy_now_qty = parseInt(searchParams.get('qty') || 1);
      }

      // Create Order in backend
      const res = await api.post('/orders/', orderPayload);
      const createdOrder = res.data;

      if (paymentMethod === 'COD') {
        // For COD, only clear cart if this was a cart checkout
        if (!isBuyNow) {
          await api.post('/cart/clear/');
        }
        fetchCart();
        toast.success("Order placed successfully via Cash on Delivery!");
        navigate('/orders');
      } else {
        // Online Payment - Mock implementation
        toast.success("Redirecting to payment portal...");
        setTimeout(async () => {
          try {
            // Mock payment verification on backend
            await api.post('/payments/verify/', {
              razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substr(2, 9),
              razorpay_order_id: createdOrder.razorpay_order_id || 'order_mock_' + Math.random().toString(36).substr(2, 9),
              razorpay_signature: 'sig_mock_' + Math.random().toString(36).substr(2, 9),
              clear_cart: !isBuyNow
            });
            
            fetchCart();
            toast.success("Payment verified! Order placed successfully.");
            navigate('/orders');
          } catch (payErr) {
            toast.error("Payment verification failed.");
            setPlacing(false);
          }
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.response?.data?.detail || "Failed to place order. Try again.");
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ fontSize: '1.25rem', color: 'var(--color-gold)' }}>Loading checkout details...</div>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontFamily: 'var(--font-body)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.8rem', marginBottom: '12px' }}>Your checkout is empty</h2>
        <button onClick={() => navigate('/shop')} style={{ padding: '12px 28px', border: 'none', background: 'black', color: 'white', borderRadius: '30px', cursor: 'pointer' }}>Shop collections</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        padding: '120px 24px 80px',
        maxWidth: '1000px',
        margin: '0 auto',
        minHeight: '80vh',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-dark)'
      }}
    >
      <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '2.5rem', marginBottom: '32px' }}>
        Checkout
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left Form */}
        <form onSubmit={handlePlaceOrder} style={{
          background: 'white',
          border: '1px solid #eee',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.5rem', marginBottom: '8px' }}>
            Shipping Details
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px', color: '#666' }}>Full Name *</label>
              <input type="text" required name="fullName" value={shipping.fullName} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px', color: '#666' }}>Phone Number *</label>
              <input type="tel" required name="phone" value={shipping.phone} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px', color: '#666' }}>Street Address *</label>
            <input type="text" required name="address" value={shipping.address} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', outline: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px', color: '#666' }}>City *</label>
              <input type="text" required name="city" value={shipping.city} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px', color: '#666' }}>State *</label>
              <input type="text" required name="state" value={shipping.state} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px', color: '#666' }}>Pin Code *</label>
              <input type="text" required name="postalCode" value={shipping.postalCode} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.5rem', marginTop: '16px', marginBottom: '8px' }}>
            Payment Method
          </h2>

          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{
              flex: 1,
              border: '1.5px solid ' + (paymentMethod === 'COD' ? 'var(--color-gold)' : '#ddd'),
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: paymentMethod === 'COD' ? 'var(--color-gold-pale)' : 'white'
            }}>
              <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} style={{ accentColor: 'var(--color-gold)' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Cash on Delivery</strong>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>Pay in cash upon delivery</span>
              </div>
            </label>

            <label style={{
              flex: 1,
              border: '1.5px solid ' + (paymentMethod === 'Online' ? 'var(--color-gold)' : '#ddd'),
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: paymentMethod === 'Online' ? 'var(--color-gold-pale)' : 'white'
            }}>
              <input type="radio" name="payment" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} style={{ accentColor: 'var(--color-gold)' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Online Payment</strong>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>Pay via UPI, Cards, or Netbanking</span>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button type="button" onClick={handleCancel} style={{ flex: 1, padding: '14px', borderRadius: '30px', border: '1.5px solid black', background: 'transparent', color: 'black', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={placing} style={{ flex: 1.5, padding: '14px', borderRadius: '30px', border: 'none', background: 'var(--color-black, #000)', color: 'white', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer' }}>
              {placing ? 'Placing Order...' : 'Place Order • ₹' + totalAmount.toLocaleString('en-IN')}
            </button>
          </div>
        </form>

        {/* Right Details */}
        <div style={{
          background: 'white',
          border: '1px solid #eee',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.4rem', marginBottom: '20px' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            {displayItems.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img src={item.image} alt="" style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { e.target.src = '/assets/logo.jpg'; }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block' }}>{item.name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>{item.qty || 1} x ₹{parseFloat(item.price).toLocaleString('en-IN')}</span>
                </div>
                <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>₹{((item.qty || 1) * parseFloat(item.price)).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
            <span>Total Payable:</span>
            <span style={{ color: 'var(--color-gold)' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
