const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// CREATE category
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const id = crypto.randomUUID();
    const slug = name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    await db.query('INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)', [id, name, slug]);
    res.status(201).json({ id, name, slug });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
});

module.exports = router;
