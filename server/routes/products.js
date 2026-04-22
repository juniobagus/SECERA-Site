const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Middleware to check auth (simplified for now)
const authenticate = async (req, res, next) => {
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
    // Fetch products
    const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    
    // Fetch variants and images in parallel
    const [variants] = await db.query('SELECT * FROM product_variants');
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

    const [variants] = await db.query('SELECT * FROM product_variants WHERE product_id = ?', [req.params.id]);
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
  const { name, short_name, description, category_id, thumbnail_url, material, weight, shopee_link, tiktok_link, details, variants, images } = req.body;
  const productId = uuidv4();

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert product
    await connection.query(
      'INSERT INTO products (id, name, short_name, description, category_id, thumbnail_url, material, weight, shopee_link, tiktok_link, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [productId, name, short_name, description, category_id, thumbnail_url, material, weight, shopee_link, tiktok_link, JSON.stringify(details)]
    );

    // 2. Insert variants
    if (variants && variants.length > 0) {
      for (const v of variants) {
        await connection.query(
          'INSERT INTO product_variants (id, product_id, sku, color, option_name, price, promo_price, cost_price, stock, is_bundle, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [uuidv4(), productId, v.sku, v.color, v.option_name || v.option, v.price, v.promo_price || v.promoPrice, v.cost_price || 0, v.stock, v.is_bundle || false, v.image_url || v.image]
        );
      }
    }

    // 3. Insert images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await connection.query(
          'INSERT INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)',
          [uuidv4(), productId, images[i].url || images[i], i]
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
  const { name, short_name, description, category_id, thumbnail_url, material, weight, shopee_link, tiktok_link, details, variants, images } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update product
    await connection.query(
      'UPDATE products SET name = ?, short_name = ?, description = ?, category_id = ?, thumbnail_url = ?, material = ?, weight = ?, shopee_link = ?, tiktok_link = ?, details = ? WHERE id = ?',
      [name, short_name, description, category_id, thumbnail_url, material, weight, shopee_link, tiktok_link, JSON.stringify(details), productId]
    );

    // 2. Refresh variants
    await connection.query('DELETE FROM product_variants WHERE product_id = ?', [productId]);
    if (variants && variants.length > 0) {
      for (const v of variants) {
        await connection.query(
          'INSERT INTO product_variants (id, product_id, sku, color, option_name, price, promo_price, cost_price, stock, is_bundle, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [uuidv4(), productId, v.sku, v.color, v.option_name || v.option, v.price, v.promo_price || v.promoPrice, v.cost_price || 0, v.stock, v.is_bundle || false, v.image_url || v.image]
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

// DELETE product
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
