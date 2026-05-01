const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateAdmin } = require('../middleware/auth');

// GET all notifications (Admin)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// GET unread count (Admin)
router.get('/unread-count', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE is_read = FALSE'
    );
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
});

// PATCH mark as read (Admin)
router.patch('/:id/read', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking as read:', err);
    res.status(500).json({ message: 'Error marking as read' });
  }
});

// PATCH mark all as read (Admin)
router.patch('/read-all', authenticateAdmin, async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = TRUE');
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking all as read:', err);
    res.status(500).json({ message: 'Error marking all as read' });
  }
});

module.exports = router;
