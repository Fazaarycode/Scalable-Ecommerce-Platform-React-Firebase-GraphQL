import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Header.css';

export default function Header() {
  const { currentUser, logout, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">Zimozi E-Commerce</Link>
          </div>
          
          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              
              {currentUser ? (
                <>
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link">Profile</Link>
                  </li>
                  
                  {isAdmin && (
                    <li className="nav-item">
                      <Link to="/admin" className="nav-link">Admin</Link>
                    </li>
                  )}
                  
                  <li className="nav-item">
                    <button onClick={handleLogout} className="nav-link btn-link">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/signup" className="nav-link">Sign Up</Link>
                  </li>
                </>
              )}
              
              <li className="nav-item cart-icon">
                <Link to="/cart" className="nav-link">
                  Cart
                  {currentUser && (
                    <span className="cart-count">{getCartItemCount()}</span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 