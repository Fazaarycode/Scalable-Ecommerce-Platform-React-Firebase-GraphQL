import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
  } from 'firebase/firestore';
  import { db } from '../firebase/config';
  import { clearCart } from './cartService';
  
  // Create a new order
  export async function createOrder(userId, cartItems, shippingAddress) {
    try {
      const newOrder = {
        userId,
        items: cartItems.items,
        total: cartItems.total,
        status: 'pending',
        shippingAddress,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const orderRef = await addDoc(collection(db, 'orders'), newOrder);
      
      // Clear the user's cart after successful order
      await clearCart(userId);
      
      return {
        orderId: orderRef.id,
        ...newOrder
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
  
  // Get user's orders
  export async function getUserOrders(userId) {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        orderId: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  }
  
  // Get order by ID
  export async function getOrderById(orderId) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }
      
      return {
        orderId: orderDoc.id,
        ...orderDoc.data()
      };
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }
  
  // Update order status (admin only)
  export async function updateOrderStatus(orderId, status) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }
      
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp()
      });
      
      return {
        orderId,
        status,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
  
  // Get all orders (admin only)
  export async function getAllOrders() {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        orderId: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  }
  
  // Get orders by status (admin only)
  export async function getOrdersByStatus(status) {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        orderId: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting orders by status:', error);
      throw error;
    }
  }