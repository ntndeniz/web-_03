import { Router } from 'express';
import ProductController from '../controllers/product/ProductController';
import { authenticate, authorize } from '../middlewares/auth/authMiddleware';
import { uploadMiddleware } from '../middlewares/upload/uploadMiddleware';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);

// Admin routes
router.post('/',
    authenticate,
    authorize('admin'),
    uploadMiddleware.array('images', 5),
    ProductController.createProduct
);

router.put('/:id',
    authenticate,
    authorize('admin'),
    uploadMiddleware.array('images', 5),
    ProductController.updateProduct
);

router.delete('/:id',
    authenticate,
    authorize('admin'),
    ProductController.deleteProduct
);

export default router; 