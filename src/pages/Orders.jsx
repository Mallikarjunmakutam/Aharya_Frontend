import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/');
        setOrders(res.data.results || res.data || []);
      } catch (err) {
        console.error("Failed to fetch user orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--color-gold)' }}>Loading your orders...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        padding: '120px 24px 80px',
        maxWidth: '900px',
        margin: '0 auto',
        minHeight: '80vh',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-dark)'
      }}
    >
      <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '2.5rem', marginBottom: '32px' }}>
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          border: '1.5px dashed #ddd',
          borderRadius: '16px',
          background: '#fafaf9'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛍️</div>
          <h2 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.5rem', marginBottom: '8px' }}>
            No orders yet
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Looks like you haven't placed any orders yet. Explore our handcrafted collections!
          </p>
          <button 
            onClick={() => navigate('/shop')}
            style={{
              padding: '12px 28px',
              borderRadius: '30px',
              border: 'none',
              background: 'var(--color-black, #000)',
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer'
            }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map(order => (
            <div 
              key={order.id}
              style={{
                background: 'white',
                border: '1px solid #eee',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              {/* Order Head */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                borderBottom: '1px solid #f0f0f0',
                paddingBottom: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#888', display: 'block' }}>Order ID</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{order.id.slice(0, 18)}...</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#888', display: 'block' }}>Date Placed</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#888', display: 'block' }}>Payment Status</span>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: order.payment_status === 'Paid' ? '#e8f8f0' : '#fff9e6',
                    color: order.payment_status === 'Paid' ? '#27ae60' : '#f59e0b'
                  }}>
                    {order.payment_status}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#888', display: 'block' }}>Fulfillment</span>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: order.order_status === 'Delivered' ? '#e8f8f0' : order.order_status === 'Shipped' ? '#e6f3ff' : '#f4f4f4',
                    color: order.order_status === 'Delivered' ? '#27ae60' : order.order_status === 'Shipped' ? '#0078d4' : '#666'
                  }}>
                    {order.order_status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {order.items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '500' }}>{item.product_name}</span>
                      <span style={{ fontSize: '0.82rem', color: '#888' }}>Qty: {item.quantity}</span>
                    </div>
                    <span style={{ fontWeight: '600' }}>₹{parseFloat(item.price).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Order Foot */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #f0f0f0',
                paddingTop: '16px'
              }}>
                <span style={{ color: '#666' }}>Total Amount</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>
                  ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
