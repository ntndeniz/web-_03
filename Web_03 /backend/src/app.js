const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // IP başına istek limiti
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./auth/routes'));
app.use('/api/products', require('./products/routes'));
app.use('/api/orders', require('./orders/routes'));
app.use('/api/payments', require('./payments/routes'));

// Hata yakalama
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Bir hata oluştu!' });
});

module.exports = app; 