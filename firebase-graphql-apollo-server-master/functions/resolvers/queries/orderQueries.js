// @ts-nocheck
const admin = require("../../database/database");
const { AuthenticationError } = require('apollo-server-express');

const orderQueries = {
  order: async (_, { orderId }, context) => {
    const userId = context.userId;
    if (!userId) throw new Error('Must be logged in to view order');

    const snapshot = await admin
      .database()
      .ref(`orders/${orderId}`)
      .once("value");
    
    const order = snapshot.val();
    if (!order) throw new Error('Order not found');
    
    // Only allow users to view their own orders unless admin
    if (order.userId !== userId && !context.isAdmin) {
      throw new AuthenticationError('Not authorized to view this order');
    }

    return {
      id: snapshot.key,
      ...order
    };
  },

  orders: async (_, __, context) => {
    const userId = context.userId;
    if (!userId) throw new Error('Must be logged in to view orders');

    const snapshot = await admin
      .database()
      .ref('orders')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');

    const orders = [];
    snapshot.forEach(child => {
      orders.push({
        id: child.key,
        ...child.val()
      });
    });

    return orders;
  }
};

module.exports = orderQueries; 