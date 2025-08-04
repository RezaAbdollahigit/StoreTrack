const express = require('express');
const { Category, sequelize } = require('../models');
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

// Delete a single category by its ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    await category.destroy();
    return res.status(200).json({ message: 'Category successfully deleted.' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

// Delete ALL categories and RESET the ID counter
router.delete('/', async (req, res) => {
  try {
    await sequelize.query('TRUNCATE "Categories" RESTART IDENTITY CASCADE;');
    
    return res.status(200).json({ message: 'All categories and related data deleted, and ID counter has been reset.' });
  } catch (error) {
    console.error('Error truncating categories:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

module.exports = router;