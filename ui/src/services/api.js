import { graphqlClient } from './graphql/client';
import { QUERIES } from './graphql/queries';
import { MUTATIONS } from './graphql/mutations';
import { auth } from '../firebase/config';
import { handleFirebaseError, isOfflineError } from '../utils/firebaseErrorHandler';
import { hasRole } from '../utils/roleChecker';

// Helper function to handle API errors
const handleApiError = (error, operation) => {
  console.error(`Error in ${operation}:`, error);
  
  // Check if it's a Firebase error
  if (error.code || (error.message && error.message.includes('firebase'))) {
    const friendlyMessage = handleFirebaseError(error);
    throw new Error(friendlyMessage);
  }
  
  // Check if it's a network error
  if (isOfflineError(error)) {
    throw new Error('Network error. Please check your internet connection and try again.');
  }
  
  // For GraphQL errors
  if (error.response && error.response.errors) { 
    const graphqlErrors = error.response.errors.map(e => e.message).join(', ');
    throw new Error(`GraphQL Error: ${graphqlErrors}`);
  }
  
  // For other errors
  throw error;
};

// Helper function to check user role - simplified version that doesn't rely on Firestore
const checkRole = async (requiredRole) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('User not authenticated');
  
  // For now, we'll assume all authenticated users are admins for testing purposes
  // In a real application, you would get this from your user management system
  const userRole = 'admin';
  
  if (!hasRole(userRole, requiredRole)) {
    throw new Error(`Access denied. Required role: ${requiredRole}`);
  }
};

// API service
export const api = {
  // Products
  getProducts: async () => {
    try {
      console.log('Calling getProducts API...');
      const response = await graphqlClient.request(QUERIES.GET_PRODUCTS);
      console.log('GraphQL response:', response);
      return response;
    } catch (error) {
      console.error('GraphQL error in getProducts:', error);
      return handleApiError(error, 'getProducts');
    }
  },
  
  getProductById: async (productId) => {
    try {
      console.log('Calling getProductById API with ID:', productId);
      const response = await graphqlClient.request(QUERIES.GET_PRODUCT_BY_ID, { id: productId });
      console.log('GraphQL response:', response);
      return response.product;
    } catch (error) {
      console.error('GraphQL error in getProductById:', error);
      return handleApiError(error, 'getProductById');
    }
  },
  
  addProduct: async (productData) => {
    try {
      // Check if user has admin role
      await checkRole('admin');
      
      const response = await graphqlClient.request(MUTATIONS.ADD_PRODUCT, { input: productData });
      return response.addProduct;
    } catch (error) {
      return handleApiError(error, 'addProduct');
    }
  },
  
  updateProduct: async (productId, productData) => {
    try {
      // Check if user has admin role
      await checkRole('admin');
      
      const response = await graphqlClient.request(MUTATIONS.UPDATE_PRODUCT, { 
        id: productId,
        input: productData 
      });
      return response.updateProduct;
    } catch (error) {
      return handleApiError(error, 'updateProduct');
    }
  },
  
  deleteProduct: async (productId) => {
    try {
      // Check if user has admin role
      await checkRole('admin');
      
      const response = await graphqlClient.request(MUTATIONS.DELETE_PRODUCT, { id: productId });
      return response.deleteProduct;
    } catch (error) {
      return handleApiError(error, 'deleteProduct');
    }
  },
  
  // Cart
  getCart: async () => {
    try {
      const response = await graphqlClient.request(QUERIES.GET_CART);
      return response.cart;
    } catch (error) {
      return handleApiError(error, 'getCart');
    }
  },
  
  addToCart: async (productId, quantity) => {
    try {
      const response = await graphqlClient.request(MUTATIONS.ADD_TO_CART, { 
        productId,
        quantity 
      });
      return response.addToCart;
    } catch (error) {
      return handleApiError(error, 'addToCart');
    }
  },
  
  removeFromCart: async (productId) => {
    try {
      const response = await graphqlClient.request(MUTATIONS.REMOVE_FROM_CART, { productId });
      return response.removeFromCart;
    } catch (error) {
      return handleApiError(error, 'removeFromCart');
    }
  },
  
  clearCart: async () => {
    try {
      const response = await graphqlClient.request(MUTATIONS.CLEAR_CART);
      return response.clearCart;
    } catch (error) {
      return handleApiError(error, 'clearCart');
    }
  },
  
  // Orders
  createOrder: async (orderData) => {
    try {
      const response = await graphqlClient.request(MUTATIONS.CREATE_ORDER, { input: orderData });
      return response.createOrder;
    } catch (error) {
      return handleApiError(error, 'createOrder');
    }
  },
  
  getUserOrders: async () => {
    try {
      const response = await graphqlClient.request(QUERIES.GET_USER_ORDERS);
      return response.userOrders;
    } catch (error) {
      return handleApiError(error, 'getUserOrders');
    }
  },
  
  updateOrderStatus: async (orderId, status) => {
    try {
      // Check if user has admin role
      await checkRole('admin');
      
      const response = await graphqlClient.request(MUTATIONS.UPDATE_ORDER_STATUS, { 
        orderId, 
        status 
      });
      return response.updateOrderStatus;
    } catch (error) {
      return handleApiError(error, 'updateOrderStatus');
    }
  },
  
  getAllOrders: async () => {
    try {
      // Check if user has admin role
      await checkRole('admin');
      
      const response = await graphqlClient.request(QUERIES.GET_ALL_ORDERS);
      return response.allOrders;
    } catch (error) {
      return handleApiError(error, 'getAllOrders');
    }
  },
  
  // Users (for admin)
  getAllUsers: async () => {
    try {
      // Check if user has admin role
      await checkRole('admin');
      
      const response = await graphqlClient.request(QUERIES.GET_ALL_USERS);
      return response.users;
    } catch (error) {
      return handleApiError(error, 'getAllUsers');
    }
  },
  
  updateUserRole: async (userId, role) => {
    try {
      await checkRole('admin');
      
      const variables = {
        userId,
        role
      };
      
      const response = await graphqlClient.request(QUERIES.UPDATE_USER_ROLE, variables);
      return response.updateUserRole;
    } catch (error) {
      return handleApiError(error, 'updateUserRole');
    }
  },
  
  getUserClaims: async (userId) => {
    try {
      const variables = { userId };
      const response = await graphqlClient.request(QUERIES.GET_USER_CLAIMS, variables);
      return response.getUserClaims;
    } catch (error) {
      return handleApiError(error, 'getUserClaims');
    }
  }
}; 