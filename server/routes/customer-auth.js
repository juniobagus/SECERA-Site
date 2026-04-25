const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register customer
router.post('/register', async (req, res) => {
  const { email, password, name, phone, captcha } = req.body;
  const captchaToken = req.cookies.captcha_token;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, dan nama wajib diisi' });
  }

  if (!captcha) {
    return res.status(400).json({ message: 'Captcha wajib diisi' });
  }

  try {
    // Verify Captcha
    if (!captchaToken) {
      return res.status(400).json({ message: 'Captcha kedaluwarsa, silakan segarkan halaman' });
    }

    const decodedCaptcha = jwt.verify(captchaToken, JWT_SECRET);
    if (decodedCaptcha.text !== captcha.toLowerCase()) {
      return res.status(400).json({ message: 'Kode Captcha salah' });
    }

    res.clearCookie('captcha_token'); // Clear after use
    const [existing] = await db.query('SELECT id FROM customer_users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const id = uuidv4();

    await db.query(
      'INSERT INTO customer_users (id, email, password_hash, name, phone) VALUES (?, ?, ?, ?, ?)',
      [id, email, password_hash, name, phone || null]
    );

    // Auto-login after register
    const token = jwt.sign({ id, email, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      user: { id, email, name, phone: phone || null },
      token
    });
  } catch (err) {
    console.error('Customer register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login customer
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM customer_users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        province: user.province,
        province_id: user.province_id,
        city_id: user.city_id,
        postal_code: user.postal_code,
      },
      token
    });
  } catch (err) {
    console.error('Customer login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get session
router.get('/session', async (req, res) => {
  const token = req.cookies.customer_token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.query(
      'SELECT id, email, name, phone, address, city, province, province_id, city_id, postal_code FROM customer_users WHERE id = ?',
      [decoded.id]
    );
    if (rows.length === 0) return res.status(401).json({ message: 'User not found' });

    res.json({ user: rows[0] });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update profile
router.patch('/profile', async (req, res) => {
  const token = req.cookies.customer_token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, phone, address, city, province, province_id, city_id, postal_code } = req.body;

    await db.query(
      'UPDATE customer_users SET name=?, phone=?, address=?, city=?, province=?, province_id=?, city_id=?, postal_code=? WHERE id=?',
      [name, phone, address, city, province, province_id, city_id, postal_code, decoded.id]
    );

    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('customer_token');
  res.json({ message: 'Logged out' });
});

module.exports = router;
