// @ts-nocheck
const admin = require("../../database/database");

const cartMutations = {
  addToCart: async (_, { productId, quantity }, context) => {
    const userId = context.userId || context.guestId;
    if (!userId) throw new Error('User not authenticated');

    const cartRef = admin.database().ref(`carts/${userId}`);
    const productRef = admin.database().ref(`products/${productId}`);

    // Check product exists and has enough stock
    const productSnapshot = await productRef.once("value");
    const product = productSnapshot.val();
    
    if (!product) throw new Error('Product not found');
    if (!product.inStock) throw new Error('Product out of stock');

    // Update cart
    const cartSnapshot = await cartRef.once("value");
    const cart = cartSnapshot.val() || { items: [] };
    
    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cartRef.set(cart);
    return cart;
  },

  removeFromCart: async (_, { productId }, context) => {
    const userId = context.userId || context.guestId;
    if (!userId) throw new Error('User not authenticated');

    const cartRef = admin.database().ref(`carts/${userId}`);
    const cartSnapshot = await cartRef.once("value");
    const cart = cartSnapshot.val();

    if (cart) {
      cart.items = cart.items.filter(item => item.productId !== productId);
      await cartRef.set(cart);
    }

    return cart;
  }
};

module.exports = cartMutations; 