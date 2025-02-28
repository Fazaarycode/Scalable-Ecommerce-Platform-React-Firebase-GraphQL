import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Get user's cart
export async function getCart(userId) {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);
    
    if (!cartDoc.exists()) {
      // Create empty cart if it doesn't exist
      const newCart = {
        userId,
        items: [],
        total: 0,
        updatedAt: serverTimestamp()
      };
      await setDoc(cartRef, newCart);
      return newCart;
    }
    
    return cartDoc.data();
  } catch (error) {
    console.error('Error getting cart:', error);
    throw error;
  }
}

// Add item to cart
export async function addToCart(userId, product, quantity) {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);
    
    if (!cartDoc.exists()) {
      // Create new cart with item
      const newCart = {
        userId,
        items: [{
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl
        }],
        total: product.price * quantity,
        updatedAt: serverTimestamp()
      };
      await setDoc(cartRef, newCart);
      return newCart;
    }
    
    // Update existing cart
    const cart = cartDoc.data();
    const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      cart.items[existingItemIndex].quantity += quantity;
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      await updateDoc(cartRef, {
        items: cart.items,
        total: cart.total,
        updatedAt: serverTimestamp()
      });
    } else {
      // Add new item
      const newItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl
      };
      
      await updateDoc(cartRef, {
        items: arrayUnion(newItem),
        total: cart.total + (product.price * quantity),
        updatedAt: serverTimestamp()
      });
      
      cart.items.push(newItem);
      cart.total += product.price * quantity;
    }
    
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

// Remove item from cart
export async function removeFromCart(userId, productId) {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);
    
    if (!cartDoc.exists()) {
      throw new Error('Cart not found');
    }
    
    const cart = cartDoc.data();
    const itemToRemove = cart.items.find(item => item.productId === productId);
    
    if (!itemToRemove) {
      throw new Error('Item not found in cart');
    }
    
    const updatedItems = cart.items.filter(item => item.productId !== productId);
    const updatedTotal = cart.total - (itemToRemove.price * itemToRemove.quantity);
    
    await updateDoc(cartRef, {
      items: updatedItems,
      total: updatedTotal,
      updatedAt: serverTimestamp()
    });
    
    return {
      userId,
      items: updatedItems,
      total: updatedTotal
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

// Update item quantity
export async function updateCartItemQuantity(userId, productId, quantity) {
  try {
    if (quantity <= 0) {
      return removeFromCart(userId, productId);
    }
    
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);
    
    if (!cartDoc.exists()) {
      throw new Error('Cart not found');
    }
    
    const cart = cartDoc.data();
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }
    
    const oldQuantity = cart.items[itemIndex].quantity;
    cart.items[itemIndex].quantity = quantity;
    
    const priceDifference = cart.items[itemIndex].price * (quantity - oldQuantity);
    cart.total += priceDifference;
    
    await updateDoc(cartRef, {
      items: cart.items,
      total: cart.total,
      updatedAt: serverTimestamp()
    });
    
    return cart;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
}

// Clear cart
export async function clearCart(userId) {
  try {
    const cartRef = doc(db, 'carts', userId);
    await updateDoc(cartRef, {
      items: [],
      total: 0,
      updatedAt: serverTimestamp()
    });
    
    return {
      userId,
      items: [],
      total: 0
    };
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
} 