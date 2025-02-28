import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './AdminStyles.css';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await api.getAllOrders();
      setOrders(allOrders || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await api.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="admin-page">
      <h1>Order Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-content">
        <div className="list-section full-width">
          <h2>Orders List</h2>
          
          {loading ? (
            <div className="loading">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="no-items">No orders found</div>
          ) : (
            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.userId}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="btn-icon view"
                          onClick={() => viewOrderDetails(order)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          className="status-select"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={closeOrderDetails}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="order-details-section">
                <h3>Order Information</h3>
                <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
              </div>
              
              <div className="order-details-section">
                <h3>Shipping Address</h3>
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>
              
              <div className="order-details-section">
                <h3>Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="item-image">
                          <img src={item.image} alt={item.name} />
                        </td>
                        <td>{item.name}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeOrderDetails}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 