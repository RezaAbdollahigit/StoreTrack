const express = require('express');
const { Op } = require('sequelize');
const { Order, OrderItem, Product, StockMovement, sequelize } = require('../models'); 
const router = express.Router();

// API route for creating a new order
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { customerName, items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Shopping cart cannot be empty.' });
    }
    let totalAmount = 0;
    const productUpdates = [];
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t });
      if (!product) throw new Error(`Product with ID ${item.productId} not found.`);
      if (product.stockQuantity < item.quantity) throw new Error(`Not enough stock for product: ${product.name}.`);
      totalAmount += product.price * item.quantity;
      productUpdates.push({
        id: product.id,
        quantity: item.quantity,
        newStock: product.stockQuantity - item.quantity,
        price: product.price
      });
    }
    const newOrder = await Order.create({
      customerName,
      totalAmount,
      status: 'Pending'
    }, { transaction: t });
    const orderItems = productUpdates.map(p => ({
      orderId: newOrder.id,
      productId: p.id,
      quantity: p.quantity,
      price: p.price
    }));
    await OrderItem.bulkCreate(orderItems, { transaction: t });
    for (const update of productUpdates) {
      await Product.update(
        { stockQuantity: update.newStock },
        { where: { id: update.id }, transaction: t }
      );
      await StockMovement.create({
        productId: update.id,
        quantityChange: -update.quantity,
        reason: `Sale in order #${newOrder.id}`
      }, { transaction: t });
    }
    await t.commit();

    // 50-second timer to update status to "Sent"
    console.log(`Starting 50s timer to ship order #${newOrder.id}...`);
    setTimeout(async () => {
      try {
        const orderToUpdate = await Order.findByPk(newOrder.id);
        if (orderToUpdate && orderToUpdate.status === 'Pending') {
          await orderToUpdate.update({ status: 'Sent' });
          console.log(`Order #${newOrder.id} has been automatically marked as Sent.`);
        }
      } catch (timerError) {
        console.error(`Failed to auto-ship order #${newOrder.id}`, timerError);
      }
    }, 40000); // 50 seconds

    return res.status(201).json(newOrder);
  } catch (error) {
    await t.rollback();
    console.error('Error creating order:', error);
    return res.status(500).json({ error: error.message });
  }
});

// API route for reading orders with advanced search
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = {};
    
    if (search) {
      const isNumeric = !isNaN(parseFloat(search)) && isFinite(search);
      whereClause[Op.or] = [
        { customerName: { [Op.iLike]: `%${search}%` } },
      ];
      if (isNumeric) {
        whereClause[Op.or].push({ id: parseInt(search) });
      }
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: {
        model: OrderItem,
        as: 'items',
        include: { model: Product, as: 'product' }
      },
      order: [['createdAt', 'DESC']]
    });

    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

// API route for updating an order's status (for cancellation)
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['Pending', 'Sent', 'Cancelled'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status provided.' });
  }

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    
    if (order.status !== 'Pending' && status === 'Cancelled') {
        return res.status(400).json({ error: 'Only pending orders can be cancelled.' });
    }

    order.status = status;
    await order.save();

    return res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});


// Api route for deleting an order by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(id, { transaction: t });
    if (!order) {
      await t.rollback();
      return res.status(404).json({ error: 'Order not found.' });
    }

    await OrderItem.destroy({ where: { orderId: id }, transaction: t });
    await order.destroy({ transaction: t });
    await t.commit();

    return res.status(200).json({ message: 'Order and its items successfully deleted.' });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting order:', error);
    return res.status(500).json({ error: 'An error occurred on the server.' });
  }
});

module.exports = router;