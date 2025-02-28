// @ts-nocheck
const { db } = require("../../database/database");

const productQueries = {
  products: async (_, { filter }) => {
    try {
      const productsSnapshot = await db.collection('products').get();
      let products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Apply filters if provided
      if (filter) {
        if (filter.category) {
          products = products.filter(product => product.category === filter.category);
        }
        if (filter.minPrice) {
          products = products.filter(product => product.price >= filter.minPrice);
        }
        if (filter.maxPrice) {
          products = products.filter(product => product.price <= filter.maxPrice);
        }
        if (filter.inStock !== undefined) {
          products = products.filter(product => product.inStock === filter.inStock);
        }
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  product: async (_, { id }) => {
    try {
      const doc = await db.collection('products').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
};

module.exports = productQueries; 