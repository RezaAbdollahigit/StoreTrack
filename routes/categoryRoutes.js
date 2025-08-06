const express = require('express');
const { Category, Product, sequelize } = require('../models');
const fs = require('fs');
const path = require('path');
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

// Delete a single category by its ID (and its products' images)
router.delete('/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // 1. Find all products belonging to this category
    const productsToDelete = await Product.findAll({
      where: { categoryId: id }
    });

    // 2. Loop through products and synchronously delete their image files
    for (const product of productsToDelete) {
      if (product.imageUrl) {
        const fullPath = path.join(__dirname, '..', product.imageUrl);
        try {
          // First, check if the file actually exists
          if (fs.existsSync(fullPath)) {
            // Use unlinkSync to delete the file immediately
            fs.unlinkSync(fullPath);
            console.log(`Successfully deleted image file: ${fullPath}`);
          }
        } catch (err) {
          // Log an error if deletion fails, but don't stop the overall process
          console.error(`Error deleting image file ${fullPath}:`, err);
        }
      }
    }

    // 3. Destroy the category from the database
    await category.destroy();
    
    return res.status(200).json({ message: 'Category and all associated products successfully deleted.' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

module.exports = router;