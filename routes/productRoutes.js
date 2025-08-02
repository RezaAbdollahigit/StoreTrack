const express = require('express');
const { Op } = require('sequelize');
const { Product, Category } = require('../models');
const router = express.Router();

// API route for reading products with filtering and search
router.get('/', async (req, res) => {
  try {
    const { categoryId, search } = req.query; 
    const whereClause = {};

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const products = await Product.findAll({
      where: whereClause,
      include: 'category'
    });
    
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

// API for creating a product
router.post('/', async (req, res) => {
  const { name, description, price, stockQuantity, categoryId } = req.body;
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'The specified category was not found.' });
    }
    const newProduct = await Product.create({
      name,
      description,
      price,
      stockQuantity,
      categoryId
    });
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

module.exports = router;