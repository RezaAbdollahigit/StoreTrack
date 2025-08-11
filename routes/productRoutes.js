const express = require('express');
const { Product, sequelize, Category, StockMovement } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
  const { name, description, price, stockQuantity, categoryId } = req.body;
  try {
    const imageUrl = req.file ? `/public/uploads/${req.file.filename}` : null;
    const newProduct = await Product.create({ name, description, price, stockQuantity, categoryId, imageUrl });
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

// GET /api/products - Get all products with filtering
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


router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stockQuantity, categoryId, stockChangeReason } = req.body;

  const t = await sequelize.transaction();
  try {
    const product = await Product.findByPk(id, { transaction: t });
    if (!product) {
      await t.rollback();
      return res.status(404).json({ error: 'Product not found.' });
    }

    // If a new file uploaded, delete old image file (if exists)
    if (req.file && product.imageUrl) {
      const relPath = product.imageUrl.replace(/^\//, '');
      const oldImagePath = path.join(__dirname, '..', relPath);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Parse incoming numeric values correctly
    const newPrice = price !== undefined ? Number(price) : product.price;
    const newStock = stockQuantity !== undefined && stockQuantity !== '' ? Number(stockQuantity) : product.stockQuantity;
    const newCategoryId = categoryId !== undefined && categoryId !== '' ? Number(categoryId) : product.categoryId;

    // compute delta
    const oldStock = Number(product.stockQuantity ?? 0);
    const delta = newStock - oldStock;

    // update fields
    product.name = name !== undefined && name !== '' ? name : product.name;
    product.description = description !== undefined ? description : product.description;
    product.price = Number.isNaN(newPrice) ? product.price : newPrice;
    product.stockQuantity = Number.isNaN(newStock) ? product.stockQuantity : newStock;
    product.categoryId = newCategoryId || product.categoryId;

    if (req.file) {
      product.imageUrl = `/public/uploads/${req.file.filename}`;
    }

    await product.save({ transaction: t });

    // create stock movement if stock changed
    if (delta !== 0) {
      const reason = stockChangeReason || `Manual adjustment (admin)`;
      await StockMovement.create({
        quantityChange: delta,
        reason,
        productId: product.id
      }, { transaction: t });
    }

    await t.commit();
    return res.json(product);
  } catch (error) {
    await t.rollback();
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    await product.destroy();
    return res.status(200).json({ message: 'Product successfully deleted.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

router.delete('/', async (req, res) => {
  try {
    await sequelize.query('TRUNCATE "Products" RESTART IDENTITY CASCADE;');
    return res.status(200).json({ message: 'All products have been successfully deleted.' });
  } catch (error) {
    console.error('Error deleting products:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

module.exports = router;