import { Router } from 'express';
import CategoryController from '../controllers/category/CategoryController';
import { authenticate, authorize } from '../middlewares/auth/authMiddleware';
import { uploadMiddleware } from '../middlewares/upload/uploadMiddleware';

const router = Router();

// Public routes
router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategoryById);
router.get('/slug/:slug', CategoryController.getCategoryBySlug);

// Admin routes
router.post('/',
    authenticate,
    authorize('admin'),
    uploadMiddleware.single('image'),
    CategoryController.createCategory
);

router.put('/:id',
    authenticate,
    authorize('admin'),
    uploadMiddleware.single('image'),
    CategoryController.updateCategory
);

router.delete('/:id',
    authenticate,
    authorize('admin'),
    CategoryController.deleteCategory
);

router.post('/reorder',
    authenticate,
    authorize('admin'),
    CategoryController.reorderCategories
);

export default router; 