// @ts-nocheck
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const logger = require('../utils/logger');
const { faker } = require('@faker-js/faker');
const admin = require('firebase-admin');

let app;
try {
  // For production deployment
  if (process.env.FUNCTIONS_EMULATOR) {
    // Local development with emulator
    app = initializeApp({
      credential: cert(require('../../sa.json')),
    });
  } else {
    // Production environment
    app = initializeApp();  // Firebase will handle credentials automatically
  }
  
  logger.info('Firebase app initialized successfully');
} catch (error) {
  logger.error({ err: error }, 'Error initializing Firebase app');
  throw error;
}

// Initialize Firestore
const db = getFirestore();

// Configure settings
db.settings({
  ignoreUndefinedProperties: true
});

// Generate 50 products with faker
const initialProducts = Array.from({ length: 50 }, () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
  category: faker.commerce.department(),
  inStock: faker.datatype.boolean(),
  imageUrl: faker.image.url()
}));

// Generate some sample carts
const initialCarts = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
    productId: initialProducts[faker.number.int({ min: 0, max: 49 })].id,
    quantity: faker.number.int({ min: 1, max: 5 })
  })),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent()
}));

// Generate some sample orders
const initialOrders = Array.from({ length: 20 }, () => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
    productId: initialProducts[faker.number.int({ min: 0, max: 49 })].id,
    quantity: faker.number.int({ min: 1, max: 5 }),
    price: parseFloat(faker.commerce.price())
  })),
  status: faker.helpers.arrayElement(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']),
  totalAmount: parseFloat(faker.commerce.price({ min: 100, max: 2000 })),
  shippingAddress: {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    zipCode: faker.location.zipCode()
  },
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent()
}));

// Define the initialization function AFTER initialProducts
async function initializeDatabase() {
  logger.info('Starting database initialization...');
  
  try {
    const batch = db.batch();
    
    // Products initialization
    const productsRef = db.collection('products');
    initialProducts.forEach(product => {
      const docRef = productsRef.doc(product.id);
      batch.set(docRef, product, { merge: true });
    });

    // Carts initialization
    const cartsRef = db.collection('carts');
    initialCarts.forEach(cart => {
      const docRef = cartsRef.doc(cart.id);
      batch.set(docRef, cart, { merge: true });
    });

    // Orders initialization
    const ordersRef = db.collection('orders');
    initialOrders.forEach(order => {
      const docRef = ordersRef.doc(order.id);
      batch.set(docRef, order, { merge: true });
    });

    await batch.commit();
    logger.info('✅ Database seeded successfully with 50 products, 10 carts, and 20 orders');
    
  } catch (error) {
    logger.error({ error }, 'Failed to initialize database');
    throw error;
  }
}

// Only initialize database if we're in emulator mode
if (process.env.FUNCTIONS_EMULATOR) {
  logger.info('Attempting to initialize emulator database...');
  initializeDatabase()
    .then(() => logger.info('✅ Database initialized in emulator mode'))
    .catch(err => {
      logger.error({ err }, '❌ Failed to initialize emulator database');
      console.error('Initialization Error Details:', err);
    });
}

if (!admin.apps.length) {
  console.log('Initializing Firebase Admin...');
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

const adminDb = admin.firestore();
console.log('Firestore instance created');

module.exports = { 
  app, 
  db,
  initializeDatabase,
  admin,
  adminDb,
  auth: admin.auth()
};