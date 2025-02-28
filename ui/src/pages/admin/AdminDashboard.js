import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import './AdminStyles.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsResponse = await api.getProducts();
      const products = productsResponse.products || [];
      
      // Fetch orders (placeholder - implement getAllOrders in your API)
      const orders = await api.getAllOrders() || [];
      
      // Fetch users (placeholder - implement getAllUsers in your API)
      const users = await api.getAllUsers() || [];
      
      // Calculate low stock products (less than 5 in stock)
      const lowStockProducts = products.filter(product => 
        product.inStock === false || (product.stockQuantity !== undefined && product.stockQuantity < 5)
      );
      
      // Get recent orders (last 5)
      const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        recentOrders,
        lowStockProducts
      });
      
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Admin Dashboard</h1>
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <h1>Admin Dashboard</h1>
        <div className="error-message">{error}</div>
        <button 
          className="btn btn-primary" 
          onClick={fetchDashboardData}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
            <Link to="/admin/products" className="stat-link">Manage Products</Link>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
            <Link to="/admin/orders" className="stat-link">Manage Orders</Link>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <Link to="/admin/users" className="stat-link">Manage Users</Link>
          </div>
        </div>
      </div>
      
      <div className="admin-content">
        <div className="dashboard-section">
          <h2>Recent Orders</h2>
          {stats.recentOrders.length === 0 ? (
            <div className="no-items">No recent orders</div>
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
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.userId}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="section-footer">
            <Link to="/admin/orders" className="btn btn-secondary">View All Orders</Link>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Low Stock Products</h2>
          {stats.lowStockProducts.length === 0 ? (
            <div className="no-items">No low stock products</div>
          ) : (
            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="item-image">
                        <img src={product.image} alt={product.name} />
                      </td>
                      <td>{product.name}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                          {product.inStock ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="section-footer">
            <Link to="/admin/products" className="btn btn-secondary">Manage Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 