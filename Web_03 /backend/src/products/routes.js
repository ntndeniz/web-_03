const express = require('express');
const router = express.Router();
const productController = require('./productController');
const authMiddleware = require('../middleware/auth');

// Herkese açık rotalar
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/search', productController.searchProducts);

// Sadece admin kullanıcılar için
router.post('/', authMiddleware.isAdmin, productController.createProduct);
router.put('/:id', authMiddleware.isAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware.isAdmin, productController.deleteProduct);

module.exports = router; 