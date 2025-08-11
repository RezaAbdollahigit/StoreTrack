const express = require('express');
const { StockMovement, Product } = require('../models');
const router = express.Router();

// GET /api/stock/history - Fetches all stock movement records
router.get('/history', async (req, res) => {
  try {
    const history = await StockMovement.findAll({
      include: {
        model: Product, // Include the product details for each movement
        as: 'product'
      },
      order: [['createdAt', 'DESC']] // Show the most recent movements first
    });
    return res.json(history);
  } catch (error) {
    console.error('Error fetching stock history:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

module.exports = router;