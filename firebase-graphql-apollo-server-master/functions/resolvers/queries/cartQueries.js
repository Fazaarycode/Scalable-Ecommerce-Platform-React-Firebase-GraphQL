// @ts-nocheck
const admin = require("../../database/database");

const cartQueries = {
  cart: async (_, __, context) => {
    const userId = context.userId || context.guestId;
    if (!userId) throw new Error('User not authenticated');

    const snapshot = await admin
      .database()
      .ref(`carts/${userId}`)
      .once("value");

    const cart = snapshot.val() || { items: [] };
    return cart;
  }
};

module.exports = cartQueries; 