const express = require('express');
const router = express.Router();
const db = require('../db');

// GET CMS content
router.get('/:key', async (req, res) => {
  const { key } = req.params;
  console.log('Fetching CMS content for key:', key);
  try {
    const [rows] = await db.query('SELECT value_data FROM cms_settings WHERE key_name = ?', [key]);
    if (rows.length === 0) {
      console.log('CMS content not found for key:', key);
      return res.json(null);
    }
    console.log('CMS content found');
    res.json(rows[0].value_data);
  } catch (err) {
    console.error(`Error fetching CMS content for key ${key}:`, err);
    res.status(500).json({ 
      message: 'Error fetching CMS content', 
      key,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
  }
});

// SAVE CMS content
router.post('/:key', async (req, res) => {
  const { key } = req.params;
  const content = req.body;
  console.log('Saving CMS content for key:', key);
  try {
    await db.query(
      'INSERT INTO cms_settings (key_name, value_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_data = ?',
      [key, JSON.stringify(content), JSON.stringify(content)]
    );
    console.log('CMS content saved successfully');
    res.json({ message: 'CMS content saved successfully' });
  } catch (err) {
    console.error('Error saving CMS content:', err);
    res.status(500).json({ message: 'Error saving CMS content', error: err.message });
  }
});

module.exports = router;
