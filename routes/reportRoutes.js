const express = require('express');
const { Op } = require('sequelize');
const { Product, Order } = require('../models');
const router = express.Router();

// API route for low stock report
router.get('/low-stock', async (req, res) => {
  try {
    const LOW_STOCK_THRESHOLD = 10; 
    const lowStockProducts = await Product.findAll({
      where: {
        stockQuantity: {
          [Op.lte]: LOW_STOCK_THRESHOLD 
        }
      }
    });
    return res.json(lowStockProducts);
  } catch (error) {
    console.error('Error fetching low stock report:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

// API route for sales report
router.get('/sales', async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('totalAmount');

    res.json({
      totalOrders: totalOrders,
      totalRevenue: totalRevenue || 0 
    });
  } catch (error) {
    console.error('Error fetching sales report:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

module.exports = router;