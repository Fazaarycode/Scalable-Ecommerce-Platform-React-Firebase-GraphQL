const { db } = require('../database/database');
const { faker } = require('@faker-js/faker');

const PRODUCTS_COUNT = 50;

const generateFakeProduct = () => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price()),
  category: faker.commerce.department(),
  imageUrl: faker.image.url(),
  inStock: faker.datatype.boolean(),
  quantity: faker.number.int({ min: 1, max: 50 }),
  createdAt: new Date().toISOString()
});

const seedDatabase = async () => {
  try {
    // Clear existing products
    const existingProducts = await db.collection('products').get();
    const batch = db.batch();
    existingProducts.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Add new products
    const products = [];
    for (let i = 0; i < PRODUCTS_COUNT; i++) {
      const product = generateFakeProduct();
      const docRef = await db.collection('products').add(product);
      products.push({ id: docRef.id, ...product });
    }

    console.log(`✅ Successfully seeded ${products.length} products`);
    return products;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = { seedDatabase }; 