const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
app.set('trust proxy', 1);

// Rate Limiter for general API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Increased for development and high-burst asset activity
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.' },
  // CMS editing in the admin panel can legitimately generate many calls; it has its own client-side
  // throttling. Skipping it here avoids blocking admins after a burst of asset/API activity.
  skip: (req) => req.path.startsWith('/cms')
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan login, silakan coba lagi dalam 15 menit.' }
});

// Middleware
// Apply the general API rate limiter only to API routes (not static assets like /uploads).
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/customer/login', authLimiter);
app.use('/api/customer/register', authLimiter);

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Basic test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SECERA Backend is running' });
});

// Routes (will be added soon)
const authRoutes = require('./routes/auth');
const customerAuthRoutes = require('./routes/customer-auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const cmsRoutes = require('./routes/cms');
const uploadRoutes = require('./routes/uploads');
const shippingRoutes = require('./routes/shipping');
const settingsRoutes = require('./routes/cms_settings');
const customerRoutes = require('./routes/customers');
const captchaRoutes = require('./routes/captcha');
const notificationRoutes = require('./routes/notifications');
const notificationDeliveryRoutes = require('./routes/admin/notification-deliveries');
const jobRoutes = require('./routes/jobs');
const tagRoutes = require('./routes/tags');
const path = require('path');
const { startLowStockMonitor } = require('./services/lowStockMonitor');

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerAuthRoutes);
app.use('/api/captcha', captchaRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/notification-deliveries', notificationDeliveryRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/tags', tagRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({
    message: 'Internal server error',
    error: err?.message || 'Unknown error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startLowStockMonitor();
});
