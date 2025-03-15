const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Blog yazılarını getir
router.get('/posts', blogController.getPosts);

// Tekil blog yazısını getir
router.get('/posts/:slug', blogController.getPost);

// Blog kategorilerini getir
router.get('/categories', blogController.getCategories);

// Yorum ekle (auth kontrolü şimdilik kaldırıldı)
router.post('/posts/:id/comments', blogController.addComment);

module.exports = router; 