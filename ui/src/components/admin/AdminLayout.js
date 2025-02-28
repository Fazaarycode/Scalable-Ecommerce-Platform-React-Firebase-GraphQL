import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { currentUser } = useAuth();

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <p className="admin-user">{currentUser?.email}</p>
        </div>
        
        <nav className="admin-nav">
          <Link to="/admin/users" className="admin-nav-link">
            User Management
          </Link>
          <Link to="/admin/products" className="admin-nav-link">
            Products
          </Link>
          <Link to="/admin/orders" className="admin-nav-link">
            Orders
          </Link>
        </nav>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
} 