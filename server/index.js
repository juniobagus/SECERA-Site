const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
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
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/customers', customerRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
