const express = require('express');
const { Category } = require('../models');
const router = express.Router();

// Create a new category
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ error: 'Name field is required.' });
    }
    const newCategory = await Category.create({ name });
    return res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

module.exports = router;