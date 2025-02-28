import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';
import { useCart } from '../../contexts/CartContext';

export default function Navbar() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { cartCount } = useCart();

  const isLoginPage = location.pathname === '/login';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <span className="logo-text">E-Commerce</span>
          </Link>
          
          {currentUser && !isLoginPage && (
            <div className="navbar-links">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/products" className="nav-link">
                Products
              </Link>
              <Link to="/cart" className="nav-link">
                Cart
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
              <Link to="/orders" className="nav-link">
                Orders
              </Link>
            </div>
          )}
        </div>

        <div className="navbar-right">
          {currentUser ? (
            <div className="profile-dropdown">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="profile-button"
              >
                <div className="profile-avatar">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : currentUser.email[0].toUpperCase()}
                </div>
                <span className="profile-name">
                  {currentUser.displayName || currentUser.email}
                </span>
              </button>

              {isProfileOpen && (
                <div className="dropdown-menu">
                  {userRole === 'admin' && (
                    <Link
                      to="/admin"
                      className="dropdown-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className="dropdown-item logout-button"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="login-button"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 