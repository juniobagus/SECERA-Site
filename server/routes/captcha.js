const express = require('express');
const router = express.Router();
const svgCaptcha = require('svg-captcha');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

router.get('/generate', (req, res) => {
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 3,
    color: true,
    background: '#f8f9fa'
  });

  // Store captcha text in a JWT cookie
  const captchaToken = jwt.sign({ text: captcha.text.toLowerCase() }, JWT_SECRET, { expiresIn: '5m' });
  
  res.cookie('captcha_token', captchaToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 5 * 60 * 1000 // 5 minutes
  });

  res.type('svg');
  res.status(200).send(captcha.data);
});

module.exports = router;
