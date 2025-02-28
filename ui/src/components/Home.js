import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getAllProducts();
        // Get 4 random products to feature
        const randomProducts = products
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setFeaturedProducts(randomProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Our E-Commerce Store</h1>
        <p>Find the best products at the best prices</p>
        <Link to="/products" className="shop-now-btn">Shop Now</Link>
      </div>

      {!currentUser && (
        <div className="cta-section">
          <h2>Join Our Community</h2>
          <p>Sign up to get exclusive offers and discounts</p>
          <div className="cta-buttons">
            <Link to="/signup" className="signup-btn">Sign Up</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        </div>
      )}
    </div>
  );
} 