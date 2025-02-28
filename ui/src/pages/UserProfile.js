import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import './UserProfile.css';

export default function UserProfile() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const userOrders = await api.getUserOrders();
        setOrders(userOrders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Orders coming soon - we are working on it!');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="user-profile container">
      <h1>My Account</h1>
      
      <div className="profile-section">
        <h2>Profile Information</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> {currentUser.displayName || 'N/A'}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Member Since:</strong> {new Date(currentUser.metadata.creationTime).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="orders-section">
        <h2>My Orders</h2>
        
        {loading ? (
          <div className="loading">Loading your orders...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.orderId}</h3>
                  <span className={`order-status status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="order-details">
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                  <p><strong>Items:</strong> {order.items.length}</p>
                </div>
                
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="order-item-preview">
                      <img src={item.image} alt={item.name} />
                      <div className="item-preview-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-quantity">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">+{order.items.length - 3} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 