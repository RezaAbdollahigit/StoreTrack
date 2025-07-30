const express = require('express');
const { sequelize, Category, Product } = require('./models');

const app = express();
app.use(express.json());

app.post('/categories', async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ error: 'فیلد نام اجباری است' });
    }
    const newCategory = await Category.create({ name });
    return res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ error: 'خطایی در سرور رخ داد' });
  }
});

// API خواندن دسته‌بندی‌ها
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'خطایی در سرور رخ داد' });
  }
});

// API ایجاد محصول
app.post('/products', async (req, res) => {
  const { name, description, price, stockQuantity, categoryId } = req.body;
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'دسته‌بندی مشخص شده یافت نشد' });
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
    return res.status(500).json({ error: 'خطایی در سرور رخ داد' });
  }
});

// مسیر API برای خواندن تمام محصولات به همراه دسته‌بندی آنها
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll({ include: 'category' });
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'خطایی در سرور رخ داد' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});