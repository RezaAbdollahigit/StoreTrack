const express = require('express');
const { Product, sequelize } = require('../models'); 
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

    const newProduct = await Product.create({
      name,
      description,
      price,
      stockQuantity,
      categoryId,
      imageUrl 
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

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


// Delete all the products
router.delete('/', async (req, res) => {
  try {
    await sequelize.query('TRUNCATE "Products" RESTART IDENTITY CASCADE;');
    return res.status(200).json({ message: 'All products have been successfully deleted.' });
  } catch (error) {
    console.error('Error deleting products:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

//Delete the specific product
router.delete('/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // 2. Get the path to the image file before deleting the record
    const imagePath = product.imageUrl;

    // 3. Delete the product from the database
    await product.destroy();

    // 4. If an image path exists, delete the file from the server
    if (imagePath) {
      // Construct the full file system path (e.g., D:\...\StoreTrack\public\uploads\123.jpg)
      const fullPath = path.join(__dirname, '..', imagePath);
      
      fs.unlink(fullPath, (err) => {
        if (err) {
          // Log an error if the file couldn't be deleted, but don't fail the request
          // because the database entry was already successfully removed.
          console.error(`Failed to delete image file: ${fullPath}`, err);
        } else {
          console.log(`Successfully deleted image file: ${fullPath}`);
        }
      });
    }

    return res.status(200).json({ message: 'Product successfully deleted.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

module.exports = router;