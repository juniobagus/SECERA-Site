const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Middleware to check auth (simplified for now)
const authenticate = async (req, res, next) => {
  // Bypassing auth for development to allow testing CRUD without login screen
  return next();
  
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET all products with variants and images
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT p.*, c.name as category 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
    `;
    let queryParams = [];

    if (status) {
      query += ` WHERE p.status = ? `;
      queryParams.push(status);
    } else {
      // Default behavior: show active and archived, hide trash
      query += ` WHERE p.status != 'trash' `;
    }

    query += ` ORDER BY p.created_at DESC `;

    const [products] = await db.query(query, queryParams);
    
    // Fetch variants and images in parallel
    const [variants] = await db.query('SELECT * FROM product_variants ORDER BY display_order ASC');
    const [images] = await db.query('SELECT * FROM product_images ORDER BY display_order ASC');

    // Map them together
    const result = products.map(p => ({
      ...p,
      product_variants: variants.filter(v => v.product_id === p.id),
      product_images: images.filter(i => i.product_id === p.id)
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) return res.status(404).json({ message: 'Product not found' });

    const [variants] = await db.query('SELECT * FROM product_variants WHERE product_id = ? ORDER BY display_order ASC', [req.params.id]);
    const [images] = await db.query('SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC', [req.params.id]);

    res.json({
      ...products[0],
      product_variants: variants,
      product_images: images
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// CREATE product
router.post('/', authenticate, async (req, res) => {
  const { name, short_name, description, category_id, thumbnail_url, material, weight, shopee_link, tiktok_link, details, cms_content, variants, images } = req.body;
  const productId = crypto.randomUUID();

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert product
    await connection.query(
      'INSERT INTO products (id, name, short_name, description, category_id, thumbnail_url, material, weight, shopee_link, tiktok_link, details, cms_content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [productId, name || null, short_name || null, description || null, category_id || null, thumbnail_url || null, material || null, weight || null, shopee_link || null, tiktok_link || null, details ? JSON.stringify(details) : null, cms_content ? JSON.stringify(cms_content) : null]
    );

    // 2. Insert variants
    if (variants && variants.length > 0) {
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        await connection.query(
          'INSERT INTO product_variants (id, product_id, sku, color, option_name, price, promo_price, cost_price, stock, is_bundle, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [crypto.randomUUID(), productId, v.sku || null, v.color || null, v.option_name || v.option || null, v.price || 0, v.promo_price || v.promoPrice || null, v.cost_price || 0, v.stock || 0, v.is_bundle || false, v.image_url || v.image || null, i]
        );
      }
    }

    // 3. Insert images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await connection.query(
          'INSERT INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)',
          [crypto.randomUUID(), productId, images[i].url || images[i], i]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ id: productId, message: 'Product created successfully' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error creating product', error: err.message });
  } finally {
    connection.release();
  }
});

// UPDATE product
router.put('/:id', authenticate, async (req, res) => {
  const productId = req.params.id;
  const { name, short_name, description, category_id, thumbnail_url, material, weight, shopee_link, tiktok_link, details, cms_content, variants, images } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update product
    await connection.query(
      'UPDATE products SET name = ?, short_name = ?, description = ?, category_id = ?, thumbnail_url = ?, material = ?, weight = ?, shopee_link = ?, tiktok_link = ?, details = ?, cms_content = ? WHERE id = ?',
      [name || null, short_name || null, description || null, category_id || null, thumbnail_url || null, material || null, weight || null, shopee_link || null, tiktok_link || null, details ? JSON.stringify(details) : null, cms_content ? JSON.stringify(cms_content) : null, productId]
    );

    // 2. Refresh variants
    await connection.query('DELETE FROM product_variants WHERE product_id = ?', [productId]);
    if (variants && variants.length > 0) {
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        await connection.query(
          'INSERT INTO product_variants (id, product_id, sku, color, option_name, price, promo_price, cost_price, stock, is_bundle, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [crypto.randomUUID(), productId, v.sku || null, v.color || null, v.option_name || v.option || null, v.price || 0, v.promo_price || v.promoPrice || null, v.cost_price || 0, v.stock || 0, v.is_bundle || false, v.image_url || v.image || null, i]
        );
      }
    }

    // 3. Refresh images
    await connection.query('DELETE FROM product_images WHERE product_id = ?', [productId]);
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await connection.query(
          'INSERT INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)',
          [uuidv4(), productId, images[i].url || images[i], i]
        );
      }
    }

    await connection.commit();
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error updating product', error: err.message });
  } finally {
    connection.release();
  }
});

// PATCH product (partial update)
router.patch('/:id', authenticate, async (req, res) => {
  const productId = req.params.id;
  const updates = { ...req.body };
  
  // Separate product fields from nested relations
  const variants = updates.variants;
  const images = updates.images;
  delete updates.variants;
  delete updates.images;
  delete updates.id;
  delete updates.created_at;
  delete updates.updated_at;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update product fields dynamically
    const fields = Object.keys(updates);
    if (fields.length > 0) {
      const setClause = fields.map(f => `${f} = ?`).join(', ');
      const values = fields.map(f => (f === 'details' || f === 'cms_content') ? JSON.stringify(updates[f]) : updates[f]);
      await connection.query(
        `UPDATE products SET ${setClause} WHERE id = ?`,
        [...values, productId]
      );
    }

    // 2. Refresh variants only if provided
    if (variants !== undefined) {
      await connection.query('DELETE FROM product_variants WHERE product_id = ?', [productId]);
      if (Array.isArray(variants) && variants.length > 0) {
        for (let i = 0; i < variants.length; i++) {
          const v = variants[i];
          await connection.query(
            'INSERT INTO product_variants (id, product_id, sku, color, option_name, price, promo_price, cost_price, stock, is_bundle, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [crypto.randomUUID(), productId, v.sku || null, v.color || null, v.option_name || v.option || null, v.price || 0, v.promo_price || v.promoPrice || null, v.cost_price || 0, v.stock || 0, v.is_bundle || false, v.image_url || v.image || null, i]
          );
        }
      }
    }

    // 3. Refresh images only if provided
    if (images !== undefined) {
      await connection.query('DELETE FROM product_images WHERE product_id = ?', [productId]);
      if (Array.isArray(images) && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          await connection.query(
            'INSERT INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)',
            [uuidv4(), productId, images[i].url || images[i], i]
          );
        }
      }
    }

    await connection.commit();
    res.json({ message: 'Product patched successfully' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error patching product', error: err.message });
  } finally {
    connection.release();
  }
});

// DELETE product
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check current status
    const [products] = await db.query('SELECT status FROM products WHERE id = ?', [productId]);
    if (products.length === 0) return res.status(404).json({ message: 'Product not found' });
    
    const currentStatus = products[0].status;
    
    if (currentStatus === 'trash') {
      // Permanent delete if already in trash
      await db.query('DELETE FROM products WHERE id = ?', [productId]);
      res.json({ message: 'Product permanently deleted' });
    } else {
      // Move to trash
      await db.query("UPDATE products SET status = 'trash' WHERE id = ?", [productId]);
      res.json({ message: 'Product moved to trash' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
