const express = require('express');
const { Category, Product, sequelize } = require('../models'); 
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
  const t = await sequelize.transaction();

  try {
    const category = await Category.findByPk(id, { transaction: t });
    if (!category) {
      await t.rollback();
      return res.status(404).json({ error: 'Category not found.' });
    }

    await Product.update(
      { categoryId: null },
      { where: { categoryId: id }, transaction: t }
    );

    await category.destroy({ transaction: t });

    await t.commit();
    return res.status(200).json({ message: 'Category successfully deleted. Associated products are now uncategorized.' });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting category:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

router.delete('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    await Product.update({ categoryId: null }, { where: {}, transaction: t });
    await Category.destroy({ where: {}, truncate: true, transaction: t });
    await t.commit();
    return res.status(200).json({ message: 'All categories deleted. All products are now uncategorized.' });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting categories:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});


module.exports = router;