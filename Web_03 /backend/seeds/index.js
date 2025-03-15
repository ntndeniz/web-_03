const mongoose = require('mongoose');
const blogSeeds = require('./blogSeeds');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    return blogSeeds();
  })
  .then(() => {
    console.log('Seed işlemi tamamlandı');
    process.exit();
  })
  .catch((error) => {
    console.error('Hata:', error);
    process.exit(1);
  }); 