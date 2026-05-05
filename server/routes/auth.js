const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { v4: uuidv4 } = require('uuid'); // I need to install uuid

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const otplib = require('otplib');
const qrcode = require('qrcode');

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Check if 2FA is enabled
    if (user.two_factor_enabled) {
      return res.json({ 
        requires2FA: true, 
        tempToken: jwt.sign({ id: user.id, purpose: '2fa_verify' }, JWT_SECRET, { expiresIn: '5m' }) 
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token // Send token for fallback
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify 2FA during Login
router.post('/login/2fa', async (req, res) => {
  const { tempToken, code } = req.body;
  try {
    const decoded = jwt.verify(tempToken, JWT_SECRET);
    if (decoded.purpose !== '2fa_verify') throw new Error('Invalid purpose');

    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    const user = rows[0];

    const isValid = otplib.verify({ token: code, secret: user.two_factor_secret });
    if (!isValid) {
      return res.status(401).json({ message: 'Kode 2FA tidak valid' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(401).json({ message: 'Sesi verifikasi berakhir atau tidak valid' });
  }
});

// Setup 2FA
router.post('/2fa/setup', async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const secret = otplib.generateSecret();
    const otpauth = otplib.generateURI({ 
      secret, 
      label: decoded.email, 
      issuer: 'SECERA Admin' 
    });
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    await db.query('UPDATE users SET two_factor_secret = ? WHERE id = ?', [secret, decoded.id]);

    res.json({ secret, qrCodeUrl });
  } catch (err) {
    console.error('2FA Setup Error:', err);
    res.status(500).json({ message: 'Error setting up 2FA' });
  }
});

// Enable 2FA after verification
router.post('/2fa/enable', async (req, res) => {
  const { code } = req.body;
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.query('SELECT two_factor_secret FROM users WHERE id = ?', [decoded.id]);
    const secret = rows[0].two_factor_secret;

    const isValid = otplib.verify({ token: code, secret });
    if (!isValid) {
      return res.status(400).json({ message: 'Kode tidak valid' });
    }

    await db.query('UPDATE users SET two_factor_enabled = TRUE WHERE id = ?', [decoded.id]);
    res.json({ success: true, message: '2FA enabled successfully' });
  } catch (err) {
    console.error('2FA Enable Error:', err);
    res.status(500).json({ message: 'Error enabling 2FA' });
  }
});

// Register (Admin only or first time)
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const id = uuidv4();

    await db.query('INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)', [id, email, password_hash, name]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Session
router.get('/session', async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.query('SELECT id, email, name, role, two_factor_enabled FROM users WHERE id = ?', [decoded.id]);
    if (rows.length === 0) return res.status(401).json({ message: 'User not found' });

    res.json({ user: rows[0] });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

module.exports = router;
