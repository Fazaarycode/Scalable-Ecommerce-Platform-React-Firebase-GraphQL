import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Zimozi E-Commerce</h3>
            <p>Your one-stop shop for all your needs.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/profile">My Account</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@zimozi.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Zimozi E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 