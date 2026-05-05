const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const { authenticateAdmin } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
let notificationsSchemaChecked = false;
let hasRoleColumn = false;
let hasRecipientColumn = false;

async function ensureNotificationSchemaFlags() {
  if (notificationsSchemaChecked) return;
  try {
    const [cols] = await db.query('SHOW COLUMNS FROM notifications');
    const names = cols.map((c) => c.Field);
    hasRoleColumn = names.includes('role');
    hasRecipientColumn = names.includes('recipient_id');
  } catch (err) {
    console.error('Error checking notification schema:', err.message);
  } finally {
    notificationsSchemaChecked = true;
  }
}

function getCustomerIdFromToken(req) {
  const token = req.cookies.customer_token || req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'customer') return decoded.id;
    return null;
  } catch {
    return null;
  }
}

router.get('/', authenticateAdmin, async (req, res) => {
  try {
    await ensureNotificationSchemaFlags();
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const sql = hasRoleColumn
      ? 'SELECT * FROM notifications WHERE role = "admin" ORDER BY created_at DESC LIMIT ?'
      : 'SELECT * FROM notifications ORDER BY created_at DESC LIMIT ?';
    const [rows] = await db.query(sql, [limit]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

router.get('/unread-count', authenticateAdmin, async (req, res) => {
  try {
    await ensureNotificationSchemaFlags();
    const sql = hasRoleColumn
      ? 'SELECT COUNT(*) as count FROM notifications WHERE role = "admin" AND is_read = FALSE'
      : 'SELECT COUNT(*) as count FROM notifications WHERE is_read = FALSE';
    const [rows] = await db.query(sql);
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
});

router.patch('/:id/read', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await ensureNotificationSchemaFlags();
    const sql = hasRoleColumn
      ? 'UPDATE notifications SET is_read = TRUE WHERE id = ? AND role = "admin"'
      : 'UPDATE notifications SET is_read = TRUE WHERE id = ?';
    await db.query(sql, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking as read:', err);
    res.status(500).json({ message: 'Error marking as read' });
  }
});

router.patch('/read-all', authenticateAdmin, async (req, res) => {
  try {
    await ensureNotificationSchemaFlags();
    const sql = hasRoleColumn
      ? 'UPDATE notifications SET is_read = TRUE WHERE role = "admin"'
      : 'UPDATE notifications SET is_read = TRUE';
    await db.query(sql);
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking all as read:', err);
    res.status(500).json({ message: 'Error marking all as read' });
  }
});

router.get('/customer', async (req, res) => {
  const customerId = getCustomerIdFromToken(req);
  if (!customerId) return res.status(401).json({ message: 'Not authenticated' });

  try {
    await ensureNotificationSchemaFlags();
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    if (!hasRoleColumn || !hasRecipientColumn) return res.json([]);
    const [rows] = await db.query('SELECT * FROM notifications WHERE role = "customer" AND recipient_id = ? ORDER BY created_at DESC LIMIT ?', [customerId, limit]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching customer notifications:', err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

router.get('/customer/unread-count', async (req, res) => {
  const customerId = getCustomerIdFromToken(req);
  if (!customerId) return res.status(401).json({ message: 'Not authenticated' });

  try {
    await ensureNotificationSchemaFlags();
    if (!hasRoleColumn || !hasRecipientColumn) return res.json({ count: 0 });
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE role = "customer" AND recipient_id = ? AND is_read = FALSE',
      [customerId]
    );
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
});

router.patch('/customer/:id/read', async (req, res) => {
  const customerId = getCustomerIdFromToken(req);
  if (!customerId) return res.status(401).json({ message: 'Not authenticated' });

  try {
    await ensureNotificationSchemaFlags();
    if (!hasRoleColumn || !hasRecipientColumn) return res.json({ success: true });
    await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND role = "customer" AND recipient_id = ?', [req.params.id, customerId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking customer notification as read:', err);
    res.status(500).json({ message: 'Error marking as read' });
  }
});

module.exports = router;
