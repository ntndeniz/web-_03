const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  readTime: {
    type: Number,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true
});

// Slug oluşturma middleware'i
postSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  // Türkçe karakterleri değiştir
  const turkishToEnglish = {
    'ğ': 'g', 'Ğ': 'G',
    'ü': 'u', 'Ü': 'U',
    'ş': 's', 'Ş': 'S',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ç': 'c', 'Ç': 'C'
  };
  
  let title = this.title;
  for (let key in turkishToEnglish) {
    title = title.replace(new RegExp(key, 'g'), turkishToEnglish[key]);
  }
  
  this.slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true
  });
  
  next();
});

module.exports = mongoose.model('Post', postSchema); 