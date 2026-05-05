const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');
const { authenticateAdmin } = require('../middleware/auth');

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
router.post('/', authenticateAdmin, async (req, res) => {
  const { name, slug, seo_title, seo_description, og_image_url } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const id = crypto.randomUUID();
    const finalSlug = slug || name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    await db.query(
      'INSERT INTO categories (id, name, slug, seo_title, seo_description, og_image_url) VALUES (?, ?, ?, ?, ?, ?)', 
      [id, name, finalSlug, seo_title || null, seo_description || null, og_image_url || null]
    );
    res.status(201).json({ id, name, slug: finalSlug });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
});

// UPDATE category
router.patch('/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, slug, seo_title, seo_description, og_image_url } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const finalSlug = slug || name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    await db.query(
      'UPDATE categories SET name = ?, slug = ?, seo_title = ?, seo_description = ?, og_image_url = ? WHERE id = ?', 
      [name, finalSlug, seo_title || null, seo_description || null, og_image_url || null, id]
    );
    res.json({ id, name, slug: finalSlug });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Error updating category' });
  }
});

// DELETE category
router.delete('/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Error deleting category' });
  }
});

module.exports = router;
