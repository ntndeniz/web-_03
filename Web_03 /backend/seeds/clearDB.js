const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('../models/Post');
const Category = require('../models/Category');
const User = require('../models/User');

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');

    // Tüm koleksiyonları bul ve sil
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.drop();
    }

    console.log('Veritabanı başarıyla temizlendi');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Temizleme hatası:', error);
    process.exit(1);
  }
};

clearDB(); 