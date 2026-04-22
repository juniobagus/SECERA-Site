const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

module.exports = router;
