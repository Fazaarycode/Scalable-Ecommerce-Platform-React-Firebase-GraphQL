import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllProducts } from '../../services/productService';
import { getAllOrders } from '../../services/orderService';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch products and orders
        const products = await getAllProducts();
        const orders = await getAllOrders();
        
        // Calculate stats
        const pendingOrders = orders.filter(order => order.status === 'pending');
        const shippedOrders = orders.filter(order => order.status === 'shipped');
        const deliveredOrders = orders.filter(order => order.status === 'delivered');
        
        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          pendingOrders: pendingOrders.length,
          shippedOrders: shippedOrders.length,
          deliveredOrders: deliveredOrders.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome back, {currentUser.displayName || currentUser.email}</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Products</h3>
          <p className="stat-number">{stats.totalProducts}</p>
          <Link to="/admin/products" className="stat-link">Manage Products</Link>
        </div>
        
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.totalOrders}</p>
          <Link to="/admin/orders" className="stat-link">View All Orders</Link>
        </div>
        
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-number">{stats.pendingOrders}</p>
          <Link to="/admin/orders?status=pending" className="stat-link">View Pending</Link>
        </div>
        
        <div className="stat-card">
          <h3>Shipped Orders</h3>
          <p className="stat-number">{stats.shippedOrders}</p>
          <Link to="/admin/orders?status=shipped" className="stat-link">View Shipped</Link>
        </div>
        
        <div className="stat-card">
          <h3>Delivered Orders</h3>
          <p className="stat-number">{stats.deliveredOrders}</p>
          <Link to="/admin/orders?status=delivered" className="stat-link">View Delivered</Link>
        </div>
        
        <div className="stat-card">
          <h3>User Management</h3>
          <p className="stat-action">Manage user accounts and permissions</p>
          <Link to="/admin/users" className="stat-link">Manage Users</Link>
        </div>
      </div>
      
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/products/new" className="action-button">
            Add New Product
          </Link>
          <Link to="/admin/orders?status=pending" className="action-button">
            Process Pending Orders
          </Link>
        </div>
      </div>
    </div>
  );
} 