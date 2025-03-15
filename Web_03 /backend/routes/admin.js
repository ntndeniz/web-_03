const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Tüm admin rotaları için auth ve admin middleware'lerini kullan
router.use(auth, admin);

// Dashboard
router.get('/stats', adminController.getStats);

// Blog Yazıları
router.get('/posts', adminController.getPosts);
router.post('/posts', adminController.createPost);
router.put('/posts/:id', adminController.updatePost);
router.delete('/posts/:id', adminController.deletePost);

// Kategoriler
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Yorumlar
router.get('/comments', adminController.getComments);
router.put('/comments/:id/approve', adminController.approveComment);
router.put('/comments/:id/reject', adminController.rejectComment);
router.delete('/comments/:id', adminController.deleteComment);

module.exports = router; 