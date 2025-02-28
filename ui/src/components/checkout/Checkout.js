import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCart } from '../../services/cartService';
import { createOrder } from '../../services/orderService';

export default function Checkout() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderProcessing, setOrderProcessing] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    async function fetchCart() {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        const cartData = await getCart(currentUser.uid);
        
        if (!cartData.items || cartData.items.length === 0) {
          navigate('/cart');
          return;
        }
        
        setCart(cartData);
      } catch (error) {
        setError('Failed to load cart. Please try again.');
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [currentUser, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    for (const field in shippingAddress) {
      if (!shippingAddress[field]) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }
    
    setOrderProcessing(true);
    
    try {
      const order = await createOrder(currentUser.uid, cart, shippingAddress);
      navigate('/orders', { state: { newOrder: order } });
    } catch (error) {
      setError('Failed to process your order. Please try again.');
      console.error('Error creating order:', error);
      setOrderProcessing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading checkout...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/cart')}>Back to Cart</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cart.items.map(item => (
              <div key={item.productId} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="order-total">
            <span>Total:</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="shipping-section">
            <h2>Shipping Address</h2>
            
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                name="street"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="state">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="zipCode">Zip/Postal Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={shippingAddress.country}
                onChange={handleAddressChange}
                required
              />
            </div>
          </div>
          
          <div className="payment-section">
            <h2>Payment Method</h2>
            
            <div className="payment-options">
              <div className="payment-option">
                <input
                  type="radio"
                  id="credit_card"
                  name="paymentMethod"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={handlePaymentMethodChange}
                />
                <label htmlFor="credit_card">Credit Card</label>
              </div>
              
              <div className="payment-option">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={handlePaymentMethodChange}
                />
                <label htmlFor="paypal">PayPal</label>
              </div>
            </div>
            
            {paymentMethod === 'credit_card' && (
              <div className="credit-card-form">
                <p>This is a mock checkout. No actual payment will be processed.</p>
                {/* In a real app, you would include credit card form fields here */}
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="place-order-btn"
            disabled={orderProcessing}
          >
            {orderProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
} 