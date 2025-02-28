import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        // This is a placeholder - you'll need to implement the getOrderById API method
        const orderData = await api.getUserOrders();
        const foundOrder = orderData.find(o => o.orderId === orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-confirmation container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-confirmation container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation container">
      <div className="confirmation-header">
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase</p>
      </div>
      
      {order ? (
        <div className="order-details">
          <div className="order-info">
            <h2>Order Information</h2>
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          </div>
          
          <div className="shipping-info">
            <h2>Shipping Address</h2>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
          
          <div className="order-items">
            <h2>Order Items</h2>
            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                    <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="no-order">
          <p>No order information available</p>
        </div>
      )}
      
      <div className="confirmation-actions">
        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
      </div>
    </div>
  );
} 