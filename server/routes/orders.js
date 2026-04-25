const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Helper: extract customer user_id from token (optional)
function getUserIdFromToken(req) {
  const token = req.cookies.customer_token || req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'customer') return decoded.id;
    return null;
  } catch (e) {
    return null;
  }
}

// CREATE order
router.post('/', async (req, res) => {
  try {
    const { 
      total_amount, 
      shipping_cost, 
      discount_amount, 
      shipping_name, 
      shipping_phone, 
      shipping_address, 
      shipping_city, 
      shipping_postal_code,
      shipping_province_id,
      shipping_city_id,
      notes,
      items 
    } = req.body;

    const orderId = uuidv4();
    const userId = getUserIdFromToken(req);
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Insert order
      await connection.query(
        `INSERT INTO orders (id, user_id, total_amount, shipping_cost, discount_amount, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_postal_code, shipping_province_id, shipping_city_id, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, userId, total_amount, shipping_cost || 0, discount_amount || 0, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_postal_code, shipping_province_id || null, shipping_city_id || null, notes || '']
      );

      // 2. Insert items
      if (items && items.length > 0) {
        for (const item of items) {
          await connection.query(
            'INSERT INTO order_items (id, order_id, product_id, variant_sku, quantity, price, cost_price, promo_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), orderId, item.productId || null, item.sku, item.quantity, item.price, item.cost_price || 0, item.promoPrice !== undefined ? item.promoPrice : null]
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
      if (connection) await connection.rollback();
      console.error('Error creating order:', err);
      res.status(500).json({ message: 'Error creating order', error: err.message });
    } finally {
      if (connection) connection.release();
    }
  } catch (err) {
    console.error('Internal server error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// GET all orders (Admin)
router.get('/', async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    
    // For each order, get item count (minimal for list view)
    for (const order of orders) {
      const [items] = await db.query('SELECT COUNT(*) as count FROM order_items WHERE order_id = ?', [order.id]);
      order.item_count = items[0].count;
    }
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// GET my orders (Customer — requires login)
router.get('/my', async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  try {
    // Get user's phone to also find guest orders they placed with the same phone
    const [userRows] = await db.query('SELECT phone FROM customer_users WHERE id = ?', [userId]);
    const userPhone = userRows[0]?.phone;

    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? OR (shipping_phone = ? AND shipping_phone IS NOT NULL) ORDER BY created_at DESC',
      [userId, userPhone]
    );

    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.short_name as product_name, p.thumbnail_url 
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error('Error fetching my orders:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// GET guest order lookup (by phone OR order_id + phone)
router.get('/lookup', async (req, res) => {
  const { order_id, phone } = req.query;

  if (!phone) {
    return res.status(400).json({ message: 'Nomor HP wajib diisi' });
  }

  try {
    let query = 'SELECT * FROM orders WHERE shipping_phone = ?';
    let params = [phone];

    if (order_id) {
      query += ' AND id = ?';
      params.push(order_id);
    }

    query += ' ORDER BY created_at DESC';

    const [orders] = await db.query(query, params);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan dengan nomor HP tersebut.' });
    }

    // Fetch items for each order
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.short_name as product_name, p.thumbnail_url 
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error looking up order:', err);
    res.status(500).json({ message: 'Error looking up order' });
  }
});

// GET order detail
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) return res.status(404).json({ message: 'Order not found' });
    
    const order = orders[0];
    const [items] = await db.query(`
      SELECT oi.*, p.short_name as product_name, p.thumbnail_url 
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);
    
    order.items = items;
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching order detail' });
  }
});

// UPDATE order status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, tracking_number } = req.body;

  try {
    if (tracking_number) {
      await db.query('UPDATE orders SET status = ?, tracking_number = ? WHERE id = ?', [status, tracking_number, id]);
    } else {
      await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    }
    res.json({ message: 'Order status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

module.exports = router;
