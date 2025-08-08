const express = require('express');
const { Op } = require('sequelize');
const { Order, OrderItem, Product, StockMovement, sequelize } = require('../models'); 
const router = express.Router();

// API route for creating a new order
router.post('/', async (req, res) => {
  // Start a transaction
  const t = await sequelize.transaction();

  try {
    const { customerName, items } = req.body; // Customer name and list of order items

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Shopping cart cannot be empty.' });
    }

    let totalAmount = 0;
    const productUpdates = [];

    // Step 1: Check stock and calculate total price
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t });
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }
      if (product.stockQuantity < item.quantity) {
        throw new Error(`Not enough stock for product: ${product.name}.`);
      }
      totalAmount += product.price * item.quantity;

      // Prepare for stock update
      productUpdates.push({
        id: product.id,
        quantity: item.quantity,
        newStock: product.stockQuantity - item.quantity
      });
    }

    // Step 2: Create the order in the Orders table
    const newOrder = await Order.create({
      customerName,
      totalAmount,
      status: 'Pending'
    }, { transaction: t });

    // Step 3: Create order items in the OrderItems table
    const orderItems = items.map(item => ({
      ...item,
      orderId: newOrder.id,
      price: 0 // This could be updated to the actual product price at the time of purchase
    }));
    await OrderItem.bulkCreate(orderItems, { transaction: t });

    // Step 4: Decrease product stock and record the movement
    for (const update of productUpdates) {
      // Decrease stock
      await Product.update(
        { stockQuantity: update.newStock },
        { where: { id: update.id }, transaction: t }
      );
      // Record in history
      await StockMovement.create({
        productId: update.id,
        quantityChange: -update.quantity, // Negative value for an outgoing product
        reason: `Sale in order #${newOrder.id}`
      }, { transaction: t });
    }

    // If all steps were successful, commit the transaction
    await t.commit();

    // --- Bonus Feature: Check for low stock ---
    const LOW_STOCK_THRESHOLD = 10;
    for (const update of productUpdates) {
      if (update.newStock > 0 && update.newStock <= LOW_STOCK_THRESHOLD) {
        console.log(`
          ******************** LOW STOCK WARNING ********************
          Product ID: ${update.id}
          New Stock Quantity: ${update.newStock}
          Please restock the inventory.
          ***********************************************************
        `);
      }
    }

    return res.status(201).json(newOrder);
  } catch (error) {
    // If any error occurred, rollback all changes
    await t.rollback();
    console.error('Error creating order:', error);
    return res.status(500).json({ error: error.message });
  }
});

// API route for reading orders with advanced search
router.get('/', async (req, res) => {
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
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

// API route for updating an order's status
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    order.status = status;
    await order.save();

    return res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

module.exports = router;