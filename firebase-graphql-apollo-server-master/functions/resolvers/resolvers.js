// @ts-nocheck
const productQueries = require('./queries/productQueries');
const cartQueries = require('./queries/cartQueries');
const orderQueries = require('./queries/orderQueries');
const productMutations = require('./mutations/productMutations');
const cartMutations = require('./mutations/cartMutations');
const orderMutations = require('./mutations/orderMutations');
const { db } = require('../database/database');
const logger = require('../utils/logger');

const resolvers = {
  Query: {
    ...productQueries,
    ...cartQueries,
    ...orderQueries,
    products: async () => {
      try {
        const snapshot = await db.collection('products').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        logger.error({ err: error }, 'Error fetching products');
        throw error;
      }
    },
    product: async (_, { id }) => {
      try {
        const doc = await db.collection('products').doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
      } catch (error) {
        logger.error({ err: error }, 'Error fetching single product');
        throw error;
      }
    },
    cartByUserId: async (_, { userId }) => {
      try {
        const doc = await db.collection('carts').doc(userId).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
      } catch (error) {
        logger.error({ err: error }, 'Error fetching cart');
        throw error;
      }
    },
    ordersByUserId: async (_, { userId }) => {
      try {
        const snapshot = await db.collection('orders')
          .where('userId', '==', userId)
          .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        logger.error({ err: error }, 'Error fetching orders');
        throw error;
      }
    },
    productsByCategory: async (_, { category }) => {
      try {
        const snapshot = await db.collection('products')
          .where('category', '==', category)
          .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        logger.error({ err: error }, 'Error fetching products by category');
        throw error;
      }
    },
    searchProducts: async (_, { query }) => {
      try {
        const snapshot = await db.collection('products')
          .where('name', '>=', query)
          .where('name', '<=', query + '\uf8ff')
          .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        logger.error({ err: error }, 'Error searching products');
        throw error;
      }
    }
  },
  Mutation: {
    ...productMutations,
    ...cartMutations,
    ...orderMutations,
    addProduct: async (_, { input }) => {
      try {
        const productData = {
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const docRef = await db.collection('products').add(productData);
        return {
          id: docRef.id,
          ...productData
        };
      } catch (error) {
        logger.error({ err: error }, 'Error adding product');
        throw error;
      }
    },
    createProduct: async (_, args) => {
      try {
        const productData = {
          name: args.name,
          description: args.description,
          price: args.price,
          image: args.image,
          category: args.category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const docRef = await db.collection('products').add(productData);
        return {
          id: docRef.id,
          ...productData
        };
      } catch (error) {
        logger.error({ err: error }, 'Error creating product');
        throw error;
      }
    },
  }
};

module.exports = resolvers;