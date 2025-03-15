const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?background=random'
  },
  bio: {
    type: String,
    default: 'Yazar hakkında bilgi bulunmuyor.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 