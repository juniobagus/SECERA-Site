const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { authenticateAdmin } = require('../middleware/auth');

// GET all tags
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM product_tags ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching tags:', err);
    res.status(500).json({ message: 'Error fetching tags' });
  }
});

// CREATE tag
router.post('/', authenticateAdmin, async (req, res) => {
  const { name, slug, seo_title, seo_description, og_image_url } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const id = uuidv4();
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
    await db.query(
      'INSERT INTO product_tags (id, name, slug, seo_title, seo_description, og_image_url) VALUES (?, ?, ?, ?, ?, ?)', 
      [id, name, finalSlug, seo_title || null, seo_description || null, og_image_url || null]
    );
    res.status(201).json({ id, name, slug: finalSlug });
  } catch (err) {
    console.error('Error creating tag:', err);
    res.status(500).json({ message: 'Error creating tag', error: err.message });
  }
});

// UPDATE tag
router.patch('/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, slug, seo_title, seo_description, og_image_url } = req.body;
  
  try {
    const [existing] = await db.query('SELECT * FROM product_tags WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Tag not found' });

    const finalName = name || existing[0].name;
    const finalSlug = slug || finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
    await db.query(
      'UPDATE product_tags SET name = ?, slug = ?, seo_title = ?, seo_description = ?, og_image_url = ? WHERE id = ?', 
      [finalName, finalSlug, seo_title || null, seo_description || null, og_image_url || null, id]
    );
    res.json({ id, name: finalName, slug: finalSlug });
  } catch (err) {
    console.error('Error updating tag:', err);
    res.status(500).json({ message: 'Error updating tag' });
  }
});

// DELETE tag
router.delete('/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM product_tags WHERE id = ?', [id]);
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    console.error('Error deleting tag:', err);
    res.status(500).json({ message: 'Error deleting tag' });
  }
});

module.exports = router;
