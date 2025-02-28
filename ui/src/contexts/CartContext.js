import React, { createContext, useContext, useState, useEffect } from 'react';
import { graphqlClient } from '../services/graphql/client';
import { useAuth } from './AuthContext';

// Import your GraphQL mutations
const ADD_TO_CART = `
  mutation AddToCart($userId: String!, $productId: ID!) {
    addToCart(userId: $userId, productId: $productId) {
      id
      products {
        id
        name
        price
        image
      }
      total
      cartCount
    }
  }
`;

const REMOVE_FROM_CART = `
  mutation RemoveFromCart($userId: String!, $productId: ID!) {
    removeFromCart(userId: $userId, productId: $productId) {
      id
      products {
        id
        name
        price
        image
      }
      total
      cartCount
    }
  }
`;

const UPDATE_CART_QUANTITY = `
  mutation UpdateCartQuantity($userId: String!, $productId: ID!, $quantity: Int!) {
    updateCartQuantity(userId: $userId, productId: $productId, quantity: $quantity) {
      id
      products {
        id
        name
        price
        image
      }
      total
    }
  }
`;

const GET_CART = `
  query GetCart($userId: String!) {
    cart(userId: $userId) {
      id
      products {
        id
        name
        price
        image
      } 
      total
      cartCount
    }
  }
`;

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cartCountRef = React.useRef(0);
  
  // Update ref whenever cartCount changes
  useEffect(() => {
    cartCountRef.current = cartCount;
  }, [cartCount]);
  
  // Fetch cart when user changes
  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      // If no user, clear the cart
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      setLoading(false);
    }
  }, [currentUser]);
  
  const fetchCart = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await graphqlClient.request(GET_CART, {
        userId: currentUser.uid
      });
      
      if (response.cart) {
        setCartItems(response.cart.products || []);
        setCartTotal(response.cart.total || 0);
        setCartCount(response.cart.cartCount || 0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const getCartItemCount = () => {
    return cartCountRef.current;
  };
  
  const addToCart = async (product, quantity = 1) => {
    if (!currentUser) {
      alert('Please log in to add items to your cart');
      return;
    }
    
    try {
      // Call the mutation multiple times if quantity > 1
      let response;
      for (let i = 0; i < quantity; i++) {
        response = await graphqlClient.request(ADD_TO_CART, {
          userId: currentUser.uid,
          productId: product.id
        });
      }
      console.log('response::: ', response);
      // Update state with the response from the last mutation
      if (response && response.addToCart) {
        setCartItems(response.addToCart.products || []);
        setCartTotal(response.addToCart.total || 0);
        setCartCount(response.addToCart.cartCount || 0);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message || 'Failed to add item to cart');
    }
  };
  
  const removeFromCart = async (productId) => {
    if (!currentUser) return;
    
    try {
      const response = await graphqlClient.request(REMOVE_FROM_CART, {
        userId: currentUser.uid,
        productId: productId
      });
      
      if (response.removeFromCart) {
        setCartItems(response.removeFromCart.products || []);
        setCartTotal(response.removeFromCart.total || 0);
        setCartCount(response.removeFromCart.cartCount || 0);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(error.message || 'Failed to remove item from cart');
    }
  };
  
  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity === 0) {
        await removeFromCart(productId);
        return;
      }

      const response = await graphqlClient.request(UPDATE_CART_QUANTITY, {
        userId: currentUser.uid,
        productId: productId,
        quantity: newQuantity
      });

      if (response.updateCartQuantity) {
        setCartItems(prevItems => {
          const updatedItems = prevItems.map(item => 
            item.id === productId 
              ? { ...item, quantity: newQuantity }
              : item
          );
          return updatedItems;
        });

        const newCount = response.updateCartQuantity.cartCount || getCartItemCount();
        setCartCount(newCount);
        cartCountRef.current = newCount;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity. Please try again.');
    }
  };
  
  const clearCart = async () => {
    // Implement clear cart functionality if needed
    setCartItems([]);
    setCartCount(0);
    setCartTotal(0);
  };
  
  const getCartTotal = () => {
    return cartTotal;
  };
  
  const value = {
    cartItems,
    cartCount,
    getCartItemCount,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
} 