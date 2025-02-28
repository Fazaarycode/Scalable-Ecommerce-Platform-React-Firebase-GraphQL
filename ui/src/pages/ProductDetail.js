import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../contexts/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { productId } = useParams();
  console.log('productId::: ', productId);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log('Fetching product with ID:', productId);
      
      // Call the actual API
      const productData = await api.getProductById(productId);
      console.log('API response:', productData);
      
      if (productData) {
        setProduct(productData);
        setError(null);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(`Failed to load product details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value < 1 ? 1 : value);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      setAddedToCart(true);
      
      // Reset the "Added to cart" message after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add product to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="product-detail container">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/products" className="btn btn-primary">Back to Products</Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail container">
        <div className="error-message">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="btn btn-primary">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail container">
      <div className="product-detail-container">
        <div className="product-image-container">
          <img src={product.image || 'https://via.placeholder.com/500x500'} alt={product.name} className="product-image" />
        </div>
        
        <div className="product-info-container">
          <h1 className="product-name">{product.name}</h1>
          
          <div className="product-meta">
            <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
            <span className="product-category">{product.category}</span>
            <span className={`product-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <div className="product-description">
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>
          
          {product.inStock && (
            <div className="product-actions">
              <div className="quantity-control">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max="99"
                />
              </div>
              
              <button 
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                Add to Cart
              </button>
              
              {addedToCart && (
                <div className="added-to-cart-message">
                  Product added to cart!
                </div>
              )}
            </div>
          )}
          
          <div className="product-navigation">
            <Link to="/products" className="btn btn-secondary">Back to Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 