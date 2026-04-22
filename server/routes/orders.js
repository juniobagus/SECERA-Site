const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// CREATE order
router.post('/', async (req, res) => {
  const { 
    total_amount, 
    shipping_cost, 
    discount_amount, 
    shipping_name, 
    shipping_phone, 
    shipping_address, 
    shipping_city, 
    shipping_postal_code, 
    notes,
    items 
  } = req.body;

  const orderId = uuidv4();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Insert order
    await connection.query(
      'INSERT INTO orders (id, total_amount, shipping_cost, discount_amount, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_postal_code, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderId, total_amount, shipping_cost || 0, discount_amount || 0, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_postal_code, notes]
    );

    // 2. Insert items
    if (items && items.length > 0) {
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (id, order_id, product_id, variant_sku, quantity, price, cost_price, promo_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [uuidv4(), orderId, item.productId, item.sku, item.quantity, item.price, item.cost_price || 0, item.promoPrice]
        );
        
        // 3. Update stock
        await connection.query(
          'UPDATE product_variants SET stock = stock - ? WHERE sku = ?',
          [item.quantity, item.sku]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ id: orderId, message: 'Order created successfully' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error creating order', error: err.message });
  } finally {
    connection.release();
  }
});

// GET all orders (Admin)
router.get('/', async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// UPDATE order status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Order status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

module.exports = router;
