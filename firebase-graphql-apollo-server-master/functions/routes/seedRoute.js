const express = require('express');
const { seedDatabase } = require('../seeders/databaseSeeder');

const router = express.Router();

router.post('/seed', async (req, res) => {
  try {
    const products = await seedDatabase();
    res.json({
      success: true,
      message: `Successfully seeded ${products.length} products`,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message
    });
  }
});

module.exports = router; 