// @ts-nocheck
const admin = require("../../database/database");

const cartQueries = {
  cart: async (_, { userId }, context) => {
    console.log('========== CART QUERY STARTED ==========');
    console.log('userId -- query cart::: ', userId);
    if (!userId) {
      console.log('ERROR: User not authenticated');
      throw new Error('User not authenticated');
    }
    console.log('User authenticated, proceeding with cart query');

    try {
      console.log('Getting database reference');
      const db = admin.db;
      console.log('Database reference obtained successfully');
      
      console.log(`Fetching cart document for userId: ${userId}`);
      const cartRef = db.collection('carts').doc(userId);
      const cartDoc = await cartRef.get();
      console.log('Cart document fetch completed');

      if (!cartDoc.exists) {
        console.log(`No cart found for userId: ${userId}, returning default cart`);
        // Return a default cart with required fields
        return { 
          id: userId, // Use userId as the cart id
          userId: userId,
          items: [],
          total: 0,
          products: [], // Ensure products array is present
          cartCount: 0  // Add cart count
        };
      }
      
      console.log('Cart document exists, processing data');
      const cart = cartDoc.data();
      console.log('Raw cart data:', JSON.stringify(cart));
      
      if (!cart.items) {
        console.log('No items array found in cart, initializing empty array');
        cart.items = [];
      } else {
        console.log(`Found ${cart.items.length} items in cart`);
      }
      
      // Calculate total if it doesn't exist
      const total = cart.total !== undefined ? cart.total : 0;
      console.log(`Cart total: ${total}`);
      
      // Calculate cart count
      console.log('Calculating cart count');
      const cartCount = cart.items.reduce((total, item) => {
        console.log(`Item: ${item.productId}, Quantity: ${item.quantity || 1}`);
        return total + (item.quantity || 1);
      }, 0);
      console.log(`Total cart count: ${cartCount}`);
      
      // Ensure the cart has all required fields
      console.log('Preparing final cart object for response');
      const finalCart = {
        ...cart,
        id: userId, // Use userId as the cart id if not present
        userId: userId, // Ensure userId is set
        total: total, // Ensure total is set
        products: cart.products || [], // Ensure products array is present
        cartCount: cartCount // Add cart count
      };
      
      console.log('Final cart object:', JSON.stringify(finalCart));
      console.log('========== CART QUERY COMPLETED ==========');
      return finalCart;
    } catch (error) {
      console.error('========== ERROR IN CART QUERY ==========');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }
};

module.exports = cartQueries; 