// @ts-nocheck
const admin = require("../../database/database");
const { AuthenticationError } = require('apollo-server-express');

const productMutations = {
  addProduct: async (_, { input }, context) => {
    // Check if user is admin
    if (!context.isAdmin) {
      throw new AuthenticationError('Must be an admin to perform this action');
    }

    const { 
      name, 
      image, 
      price, 
      inStock, 
      category, 
      discount 
    } = input;

    const newProduct = {
      name,
      image,
      price,
      inStock,
      category,
      discount,
      createdAt: new Date().toISOString()
    };

    const ref = await admin
      .database()
      .ref("products")
      .push(newProduct);

    return {
      id: ref.key,
      ...newProduct
    };
  },

  updateProduct: async (_, { id, input }, context) => {
    if (!context.isAdmin) {
      throw new AuthenticationError('Must be an admin to perform this action');
    }

    await admin
      .database()
      .ref(`products/${id}`)
      .update(input);

    const snapshot = await admin
      .database()
      .ref(`products/${id}`)
      .once("value");

    return {
      id: snapshot.key,
      ...snapshot.val()
    };
  },

  deleteProduct: async (_, { id }, context) => {
    if (!context.isAdmin) {
      throw new AuthenticationError('Must be an admin to perform this action');
    }

    await admin
      .database()
      .ref(`products/${id}`)
      .remove();

    return id;
  }
};

module.exports = productMutations; 