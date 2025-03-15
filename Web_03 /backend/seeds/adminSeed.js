const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Önce varsa eski admin kullanıcısını silelim
    await User.deleteOne({ email: 'admin@example.com' });

    // Yeni admin kullanıcısı oluşturalım
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123', // Gerçek uygulamada hash'lenmiş şifre kullanın
      role: 'admin'
    });

    console.log('Admin kullanıcısı oluşturuldu:', adminUser);
    process.exit(0);
  } catch (error) {
    console.error('Admin kullanıcısı oluşturulurken hata:', error);
    process.exit(1);
  }
};

createAdminUser(); 