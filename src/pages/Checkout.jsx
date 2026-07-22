import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import api from '../services/api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // If already loaded, resolve immediately
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=%2Fcheckout');
    }
  }, [user, navigate]);

  // Fetch Buy Now product details directly
  useEffect(() => {
    if (isBuyNow && buyNowProductId) {
      setLoading(true);
      const buyNowVariantId = searchParams.get('variant_id');
      api.get(`/products/${buyNowProductId}/`)
        .then(res => {
          const p = res.data;
          let selectedVariant = null;
          if (buyNowVariantId && p.variants) {
            selectedVariant = p.variants.find(v => v.id === buyNowVariantId);
          }
          
          const variantPrice = selectedVariant 
            ? (selectedVariant.discount_price && parseFloat(selectedVariant.discount_price) > 0 ? parseFloat(selectedVariant.discount_price) : parseFloat(selectedVariant.price)) 
            : null;
          const basePrice = p.discount_price && parseFloat(p.discount_price) > 0 
            ? parseFloat(p.discount_price) 
            : parseFloat(p.price);
          const price = variantPrice !== null && !isNaN(variantPrice) ? variantPrice : basePrice;

          const variantOrig = selectedVariant 
            ? (selectedVariant.discount_price && parseFloat(selectedVariant.discount_price) > 0 ? parseFloat(selectedVariant.price) : null)
            : null;
          const baseOrig = p.discount_price && parseFloat(p.discount_price) > 0 
            ? parseFloat(p.price) 
            : null;
          const originalPrice = variantOrig !== null ? variantOrig : baseOrig;

          const varImage = selectedVariant?.images?.find(img => img.is_main)?.image || selectedVariant?.images?.[0]?.image;
          const image = varImage || p.images?.find(img => img.is_main)?.image || p.images?.[0]?.image || '';
          
          const parsedProduct = {
            id: p.id,
            productId: p.id,
            variantId: selectedVariant?.id || null,
            name: p.name + (selectedVariant?.color_name ? ` - ${selectedVariant.color_name}` : ''),
            price,
            originalPrice,
            image,
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
        if (buyNowProduct?.variantId) {
          orderPayload.buy_now_variant_id = buyNowProduct.variantId;
        }
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
        // Online Payment using Razorpay
        toast.info("Initializing payment gateway...");
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error("Failed to load Razorpay SDK. Check your internet connection.");
          setPlacing(false);
          return;
        }

        // 1. Create Razorpay Order on Backend
        let razorpayOrder;
        try {
          const createOrderRes = await api.post('/payments/create-order/', {
            order_id: createdOrder.id
          });
          razorpayOrder = createOrderRes.data;
        } catch (createErr) {
          console.error("Failed to create Razorpay order:", createErr);
          toast.error(createErr.response?.data?.error || "Failed to initialize payment order.");
          setPlacing(false);
          return;
        }

        // 2. Open Razorpay Checkout popup
        const options = {
          key: razorpayOrder.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T9leOc5GMiLncg',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Āhāryā',
          description: 'Saree Purchase Order',
          image: '/assets/logo.jpg',
          order_id: razorpayOrder.id,
          handler: async function (response) {
            toast.success("Payment authorized! Verifying...");
            try {
              await api.post('/payments/verify/', {
                order_id: createdOrder.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                clear_cart: !isBuyNow
              });
              
              if (!isBuyNow) {
                await api.post('/cart/clear/');
              }
              fetchCart();
              toast.success("Payment verified! Order placed successfully.");
              navigate('/orders');
            } catch (verifyErr) {
              console.error("Payment verification failed:", verifyErr);
              toast.error("Payment verification failed. Please contact support.");
              setPlacing(false);
            }
          },
          prefill: {
            name: shipping.fullName,
            contact: shipping.phone,
            email: user?.email || '',
          },
          notes: {
            address: shipping.address,
            order_id: createdOrder.id
          },
          theme: {
            color: '#c8a84b'
          },
          modal: {
            ondismiss: function () {
              toast.info("Payment cancelled.");
              setPlacing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
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
