const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateAdmin } = require('../middleware/auth');

// GET all customers (Aggregated from orders and users)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const [customers] = await db.query(`
      WITH all_phones AS (
        SELECT DISTINCT shipping_phone as phone FROM orders
        UNION
        SELECT DISTINCT phone FROM customer_users WHERE phone IS NOT NULL
      )
      SELECT 
        p.phone, 
        COALESCE(MAX(u.name), MAX(o.shipping_name)) as name, 
        COALESCE(MAX(u.city), MAX(o.shipping_city)) as city,
        COALESCE(MAX(u.address), MAX(o.shipping_address)) as address,
        COUNT(o.id) as total_orders, 
        COALESCE(SUM(o.total_amount), 0) as total_spent, 
        MAX(o.created_at) as last_order_date,
        MAX(u.id) IS NOT NULL as is_registered,
        MAX(u.email) as registered_email
      FROM all_phones p
      LEFT JOIN orders o ON p.phone = o.shipping_phone
      LEFT JOIN customer_users u ON p.phone = u.phone
      GROUP BY p.phone 
      ORDER BY total_spent DESC, last_order_date DESC
    `);
    
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Error fetching customers' });
  }
});

// GET customer details and order history by phone
router.get('/:phone', async (req, res) => {
  const { phone } = req.params;
  try {
    // Get basic info from orders AND users
    const [info] = await db.query(`
      SELECT 
        ? as phone,
        COALESCE(MAX(u.name), MAX(o.shipping_name)) as name, 
        COALESCE(MAX(u.city), MAX(o.shipping_city)) as city,
        COALESCE(MAX(u.address), MAX(o.shipping_address)) as address,
        COUNT(o.id) as total_orders, 
        COALESCE(SUM(o.total_amount), 0) as total_spent,
        MAX(u.id) IS NOT NULL as is_registered
      FROM (SELECT ? as phone) p
      LEFT JOIN orders o ON p.phone = o.shipping_phone
      LEFT JOIN customer_users u ON p.phone = u.phone
      GROUP BY p.phone
    `, [phone, phone]);

    if (info.length === 0 || (!info[0].name && !info[0].is_registered)) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get order history
    const [orders] = await db.query(`
      SELECT id, total_amount, status, created_at 
      FROM orders 
      WHERE shipping_phone = ?
      ORDER BY created_at DESC
    `, [phone]);

    res.json({
      ...info[0],
      orders
    });
  } catch (err) {
    console.error('Error fetching customer details:', err);
    res.status(500).json({ message: 'Error fetching customer details' });
  }
});

module.exports = router;
