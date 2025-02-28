import { graphqlClient } from '../services/graphql/client';
import { QUERIES } from '../services/graphql/queries';
import { MUTATIONS } from '../services/graphql/mutations';
import { auth } from '../firebase/config';

// Test function for getting products
async function testGetProducts() {
  try {
    console.log('Testing GetProducts query...');
    const response = await graphqlClient.request(QUERIES.GET_PRODUCTS);
    console.log('Products response:', response);
    return response;
  } catch (error) {
    console.error('Error in GetProducts test:', error);
    throw error;
  }
}

// Test function for getting a product by ID
async function testGetProduct(productId) {
  try {
    console.log(`Testing GetProduct query for ID: ${productId}...`);
    const response = await graphqlClient.request(QUERIES.GET_PRODUCT, { id: productId });
    console.log('Product response:', response);
    return response;
  } catch (error) {
    console.error('Error in GetProduct test:', error);
    throw error;
  }
}

// Test function for adding to cart
async function testAddToCart(productId, quantity) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated. Please log in first.');
    
    const userId = currentUser.uid;
    console.log(`Testing AddToCart mutation for user: ${userId}, product: ${productId}, quantity: ${quantity}...`);
    
    const response = await graphqlClient.request(MUTATIONS.ADD_TO_CART, { 
      userId,
      productId, 
      quantity 
    });
    console.log('AddToCart response:', response);
    return response;
  } catch (error) {
    console.error('Error in AddToCart test:', error);
    throw error;
  }
}

// Test function for removing from cart
async function testRemoveFromCart(productId) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated. Please log in first.');
    
    const userId = currentUser.uid;
    console.log(`Testing RemoveFromCart mutation for user: ${userId}, product: ${productId}...`);
    
    const response = await graphqlClient.request(MUTATIONS.REMOVE_FROM_CART, { 
      userId,
      productId 
    });
    console.log('RemoveFromCart response:', response);
    return response;
  } catch (error) {
    console.error('Error in RemoveFromCart test:', error);
    throw error;
  }
}

// Test function for getting cart
async function testGetCart() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated. Please log in first.');
    
    const userId = currentUser.uid;
    console.log(`Testing GetCart query for user: ${userId}...`);
    
    const response = await graphqlClient.request(QUERIES.GET_CART, { userId });
    console.log('Cart response:', response);
    return response;
  } catch (error) {
    console.error('Error in GetCart test:', error);
    throw error;
  }
}

// Run all tests
async function runTests() {
  try {
    // Check if user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('User not authenticated. Please log in first to run cart tests.');
      return;
    }
    
    // First get all products
    const productsResponse = await testGetProducts();
    
    if (productsResponse && productsResponse.products && productsResponse.products.length > 0) {
      // Get the first product ID
      const firstProductId = productsResponse.products[0].id;
      
      // Test getting a single product
      await testGetProduct(firstProductId);
      
      // Test adding to cart
      await testAddToCart(firstProductId, 1);
      
      // Test getting the cart
      await testGetCart();
      
      // Test removing from cart
      await testRemoveFromCart(firstProductId);
      
      // Test getting the cart again after removal
      await testGetCart();
    } else {
      console.log('No products found to test with');
    }
    
    console.log('All tests completed!');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Export the test functions
export const graphqlTests = {
  getProducts: testGetProducts,
  getProduct: testGetProduct,
  addToCart: testAddToCart,
  removeFromCart: testRemoveFromCart,
  getCart: testGetCart,
  runAll: runTests
}; 