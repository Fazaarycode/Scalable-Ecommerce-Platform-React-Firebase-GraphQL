import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setError('Product ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        const productData = await api.getProductById(productId);
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      navigate('/login', { state: { from: `/products/${productId}` } });
      return;
    }
    
    if (product) {
      setAddingToCart(true);
      try {
        await addToCart(product, quantity);
        alert(`Added ${quantity} of ${product.name} to cart!`);
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setAddingToCart(false);
      }
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;
  
  return (
    <div className="product-detail">
      <button 
        onClick={() => navigate('/products')}
        className="back-button"
      >
        Back to Products
      </button>
      
      <h1>{product.name}</h1>
      
      <div className="product-info">
        <div className="price">${product.price?.toFixed(2) || '0.00'}</div>
        <div className="stock-status">
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </div>
        <div className="category">Category: {product.category}</div>
      </div>
      
      <div className="description">
        <h2>Description</h2>
        <p>{product.description}</p>
      </div>
      
      <div className="quantity-selector">
        <label>Quantity:</label>
        <div className="quantity-controls">
          <button onClick={decrementQuantity}>-</button>
          <input 
            type="number" 
            min="1" 
            value={quantity} 
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          />
          <button onClick={incrementQuantity}>+</button>
        </div>
      </div>
      
      <button 
        onClick={handleAddToCart}
        className="add-to-cart-button"
        disabled={!product.inStock || addingToCart}
      >
        {addingToCart ? 'Adding...' : 'Add to Cart!'}
      </button>
      
      <style jsx>{`
        .product-detail {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .back-button {
          background: none;
          border: none;
          color: #0066cc;
          cursor: pointer;
          padding: 5px 0;
          margin-bottom: 20px;
          font-size: 16px;
        }
        
        h1 {
          font-size: 28px;
          margin-bottom: 15px;
        }
        
        .product-info {
          margin-bottom: 20px;
        }
        
        .price {
          font-size: 24px;
          font-weight: bold;
          color: #2c7a2c;
          margin-bottom: 10px;
        }
        
        .stock-status {
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .category {
          color: #666;
        }
        
        .description {
          margin: 20px 0;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        .description h2 {
          font-size: 20px;
          margin-bottom: 10px;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          margin: 20px 0;
        }
        
        .quantity-selector label {
          margin-right: 15px;
          font-weight: bold;
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
        }
        
        .quantity-controls button {
          width: 30px;
          height: 30px;
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          cursor: pointer;
        }
        
        .quantity-controls input {
          width: 50px;
          height: 30px;
          text-align: center;
          border: 1px solid #ddd;
          margin: 0 5px;
        }
        
        .add-to-cart-button {
          background-color: #0066cc;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 4px;
          width: 100%;
          margin-top: 10px;
        }
        
        .add-to-cart-button:hover {
          background-color: #0055aa;
        }
        
        .add-to-cart-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
} 