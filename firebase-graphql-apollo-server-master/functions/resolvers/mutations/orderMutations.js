const { db } = require("../../database/database");
const { AuthenticationError } = require('apollo-server-express');

const orderMutations = {
  createOrder: async (_, { input }, context) => {
    const userId = context.userId;
    if (!userId) throw new Error('Must be logged in to create an order');

    const { 
      shippingAddress, 
      paymentMethod,
      cartItems 
    } = input;

    const order = {
      userId,
      shippingAddress,
      paymentMethod,
      items: cartItems,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // Create order
    const orderRef = await db.collection('orders').add(order);

    // Clear cart
    await db.collection('carts').doc(userId).delete();

    return {
      id: orderRef.id,
      ...order
    };
  },

  updateOrderStatus: async (_, { orderId, status }, context) => {
    if (!context.isAdmin) {
      throw new AuthenticationError('Must be an admin to update order status');
    }

    const orderRef = db.collection('orders').doc(orderId);
    await orderRef.update({ status });

    const orderDoc = await orderRef.get();
    
    return {
      id: orderDoc.id,
      ...orderDoc.data()
    };
  }
};

module.exports = orderMutations; 