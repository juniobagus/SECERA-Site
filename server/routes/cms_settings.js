const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateAdmin } = require('../middleware/auth');

// GET all settings
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT setting_key, setting_value FROM settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// UPDATE settings
router.post('/', authenticateAdmin, async (req, res) => {
  const settings = req.body; // { key: value, ... }
  try {
    for (const [key, value] of Object.entries(settings)) {
      await db.execute(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, String(value), String(value)]
      );
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating settings' });
  }
});

module.exports = router;
