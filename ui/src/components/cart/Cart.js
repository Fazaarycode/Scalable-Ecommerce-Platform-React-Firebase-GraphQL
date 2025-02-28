import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export default function Cart() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getCartTotal, loading, getCartItemCount } = useCart();
  
  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any products to your cart yet.</p>
        <Link to="/products" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Group identical products and use the cartCount from the API
  const groupedItems = cartItems.reduce((acc, item) => {
    const existingItemIndex = acc.findIndex(i => i.id === item.id);
    if (existingItemIndex >= 0) {
      acc[existingItemIndex].quantity += 1;
    } else {
      acc.push({
        ...item,
        quantity: getCartItemCount() // Use the total count for this product
      });
    }
    return acc;
  }, []);

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart ({getCartItemCount()} items)</h1>
      
      <div className="cart-items">
        {groupedItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
            </div>
            
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-price">${item.price.toFixed(2)} each</p>
            </div>
            
            <div className="item-quantity">
              <span>Quantity: {item.quantity}</span>
            </div>
            
            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            
            <button 
              className="remove-item-btn"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-details">
          <div className="cart-count">
            <span>Total Items:</span>
            <span>{getCartItemCount()}</span>
          </div>
          <div className="cart-total">
            <span>Total Amount:</span>
            <span>${(getCartTotal() * getCartItemCount()).toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          className="checkout-btn"
          onClick={proceedToCheckout}
          disabled={cartItems.length === 0}
        >
          Proceed to Checkout
        </button>
        
        <Link to="/products" className="continue-shopping-link">
          Continue Shopping
        </Link>
      </div>
      
      <style jsx>{`
        .cart-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h1 {
          margin-bottom: 30px;
        }
        
        .cart-items {
          margin-bottom: 30px;
        }
        
        .cart-item {
          display: flex;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }
        
        .item-image {
          width: 80px;
          height: 80px;
          overflow: hidden;
          margin-right: 15px;
        }
        
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .item-details {
          flex: 1;
        }
        
        .item-details h3 {
          margin: 0 0 5px 0;
        }
        
        .item-price {
          color: #666;
        }
        
        .item-quantity {
          margin: 0 20px;
          font-size: 16px;
          color: #666;
        }
        
        .item-total {
          font-weight: bold;
          margin: 0 20px;
          min-width: 80px;
          text-align: right;
        }
        
        .remove-item-btn {
          background: none;
          border: none;
          color: #cc0000;
          cursor: pointer;
        }
        
        .cart-summary {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 5px;
        }
        
        .cart-details {
          margin-bottom: 20px;
        }
        
        .cart-count {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .checkout-btn {
          width: 100%;
          padding: 12px;
          background: #0066cc;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 10px;
        }
        
        .checkout-btn:hover {
          background: #0055aa;
        }
        
        .checkout-btn:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }
        
        .continue-shopping-link {
          display: block;
          text-align: center;
          margin-top: 10px;
          color: #0066cc;
          text-decoration: none;
        }
        
        .empty-cart {
          text-align: center;
          padding: 50px 20px;
        }
        
        .continue-shopping-btn {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background: #0066cc;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        
        .loading {
          text-align: center;
          padding: 50px 20px;
          font-size: 18px;
          color: #666;
        }
        
        .item-description {
          color: #666;
          font-size: 0.9em;
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
} 