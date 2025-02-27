// @ts-nocheck
const admin = require("../../database/database");

const productQueries = {
  products: async (_, { category, minPrice, maxPrice, inStock }) => {
    const productsRef = admin.database().ref("products");
    const snapshot = await productsRef.once("value");
    let products = [];
    
    snapshot.forEach((child) => {
      products.push({ id: child.key, ...child.val() });
    });

    // Apply filters
    if (category) {
      products = products.filter(product => product.category === category);
    }
    if (minPrice) {
      products = products.filter(product => product.price >= minPrice);
    }
    if (maxPrice) {
      products = products.filter(product => product.price <= maxPrice);
    }
    if (inStock !== undefined) {
      products = products.filter(product => product.inStock === inStock);
    }

    return products;
  },

  product: async (_, { id }) => {
    const snapshot = await admin
      .database()
      .ref(`products/${id}`)
      .once("value");
    return { id: snapshot.key, ...snapshot.val() };
  }
};

module.exports = productQueries; 