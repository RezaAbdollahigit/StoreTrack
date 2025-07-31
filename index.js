const express = require('express');
const { Op } = require('sequelize');
const { sequelize, Category, Product, Order, OrderItem, StockMovement, User } = require('./models');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-super-secret-key-12345';
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

// مسیر API برای خواندن تمام محصولات با قابلیت فیلتر بر اساس دسته‌بندی
// مسیر API برای خواندن محصولات با قابلیت فیلتر و جستجو
app.get('/products', async (req, res) => {
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
    return res.status(500).json({ error: 'خطایی در سرور رخ داد' });
  }
});

// مسیر API برای ثبت یک سفارش جدید
app.post('/orders', async (req, res) => {
  // شروع یک تراکنش
  const t = await sequelize.transaction();

  try {
    const { customerName, items } = req.body; // نام مشتری و لیست اقلام سفارش

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'سبد خرید نمی‌تواند خالی باشد' });
    }

    let totalAmount = 0;
    const productUpdates = [];
    const stockMovements = [];

    // مرحله ۱: بررسی موجودی و محاسبه قیمت کل
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t });
      if (!product) {
        throw new Error(`محصول با شناسه ${item.productId} یافت نشد`);
      }
      if (product.stockQuantity < item.quantity) {
        throw new Error(`موجودی محصول ${product.name} کافی نیست`);
      }
      totalAmount += product.price * item.quantity;

      // آماده‌سازی برای به‌روزرسانی موجودی
      productUpdates.push({
        id: product.id,
        newStock: product.stockQuantity - item.quantity
      });
    }

    // مرحله ۲: ایجاد سفارش در جدول Orders
    const newOrder = await Order.create({
      customerName,
      totalAmount,
      status: 'در انتظار'
    }, { transaction: t });

    // مرحله ۳: ایجاد اقلام سفارش در جدول OrderItems
    const orderItems = items.map(item => ({
      ...item,
      orderId: newOrder.id,
      price: 0 // قیمت واقعی در مرحله بعد مشخص می‌شود
    }));
    await OrderItem.bulkCreate(orderItems, { transaction: t });

    // مرحله ۴: کاهش موجودی محصولات و ثبت تاریخچه
    for (const update of productUpdates) {
      // کاهش موجودی
      await Product.update(
        { stockQuantity: update.newStock },
        { where: { id: update.id }, transaction: t }
      );
      // ثبت در تاریخچه
      stockMovements.push({
        productId: update.id,
        quantityChange: -items.find(i => i.productId === update.id).quantity, // مقدار منفی برای خروج
        reason: `فروش در سفارش شماره ${newOrder.id}`
      });
    }
    await StockMovement.bulkCreate(stockMovements, { transaction: t });

    // اگر تمام مراحل موفق بود، تراکنش را تایید کن
    await t.commit();

    return res.status(201).json(newOrder);

  } catch (error) {
    // اگر خطایی رخ داد، تمام تغییرات را به حالت قبل برگردان
    await t.rollback();
    console.error('Error creating order:', error);
    return res.status(500).json({ error: error.message });
  }
});

// مسیر API برای خواندن سفارشات با قابلیت جستجوی پیشرفته
app.get('/orders', async (req, res) => {
  try {
    const { search, productName } = req.query;
    const whereClause = {};
    
    const includeClause = [{
      model: OrderItem,
      as: 'items',
      include: {
        model: Product,
        as: 'product'
      }
    }];

    if (search) {
      whereClause.customerName = { [Op.iLike]: `%${search}%` };
    }

    if (productName) {
      includeClause[0].include.where = {
        name: { [Op.iLike]: `%${productName}%` }
      };
      includeClause[0].required = true;
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: includeClause
    });

    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'خطایی در سرور رخ داد' });
  }
});

// مسیر API برای گزارش کالاهای با موجودی پایین
app.get('/reports/low-stock', async (req, res) => {
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
    return res.status(500).json({ error: 'خطایی در سرور رخ داد' });
  }
});

// مسیر API برای گزارش فروش
app.get('/reports/sales', async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('totalAmount');

    res.json({
      totalOrders: totalOrders,
      totalRevenue: totalRevenue || 0 
    });
  } catch (error) {
    console.error('Error fetching sales report:', error);
    return res.status(500).json({ error: 'خطایی در سرور رخ داد' });
  }
});

// مسیر API برای به‌روزرسانی وضعیت یک سفارش
app.patch('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'سفارش یافت نشد' });
    }

    order.status = status;
    await order.save();

    return res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'خطایی در سرور رخ داد' });
  }
});

// مسیر API برای ثبت‌نام کاربر جدید
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'ایمیل و پسورد اجباری هستند' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'کاربری با این ایمیل از قبل وجود دارد' });
    }

    const newUser = await User.create({ email, password });

    return res.status(201).json({
      id: newUser.id,
      email: newUser.email
    });

  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'خطایی در سرور رخ داد' });
  }
});

// مسیر API برای ورود کاربر
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'ایمیل یا پسورد نامعتبر است' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'ایمیل یا پسورد نامعتبر است' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET,
      { expiresIn: '1h' } 
    );

    return res.json({ message: 'ورود موفقیت‌آمیز بود', token });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'خطایی در سرور رخ داد' });
  }
});

// API برای گرفتن لیست تمام یوزرها
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'An error occurred on the server' });
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