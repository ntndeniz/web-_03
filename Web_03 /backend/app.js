const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Modelleri import et
require('./models/User');
require('./models/Post');
require('./models/Category');
require('./models/Comment');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:8080', // Frontend URL'i
  credentials: true
}));
app.use(express.json());

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Test endpoint'i
app.get('/test', (req, res) => {
  res.json({ message: 'API çalışıyor' });
});

// Routes
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);

// Server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 