import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserOrders } from '../../services/orderService';

export default function OrderHistory() {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newOrderHighlight, setNewOrderHighlight] = useState(null);

  useEffect(() => {
    // Check if we have a new order from checkout
    if (location.state?.newOrder) {
      setNewOrderHighlight(location.state.newOrder.orderId);
    }
    
    async function fetchOrders() {
      if (!currentUser) return;
      
      try {
        const userOrders = await getUserOrders(currentUser.uid);
        setOrders(userOrders);
      } catch (error) {
        setError('Failed to load orders. Please try again.');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [currentUser, location.state]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      default: return '';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet.</p>
        <Link to="/products" className="shop-now-btn">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h1>Your Order History</h1>
      
      {newOrderHighlight && (
        <div className="new-order-message">
          <p>Your order has been placed successfully!</p>
        </div>
      )}
      
      <div className="orders-list">
        {orders.map(order => (
          <div 
            key={order.orderId} 
            className={`order-card ${newOrderHighlight === order.orderId ? 'highlight' : ''}`}
          >
            <div className="order-header">
              <div className="order-id">
                <span>Order #:</span>
                <span>{order.orderId}</span>
              </div>
              
              <div className="order-date">
                <span>Date:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              
              <div className={`order-status ${getStatusClass(order.status)}`}>
                <span>Status:</span>
                <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </div>
            </div>
            
            <div className="order-items">
              <h3>Items</h3>
              <div className="items-list">
                {order.items.map(item => (
                  <div key={item.productId} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-details">
              <div className="order-total">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              
              <div className="shipping-address">
                <h3>Shipping Address</h3>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 