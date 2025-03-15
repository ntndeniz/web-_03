import { Router } from 'express';
import BlogPostController from '../controllers/blog/BlogPostController';
import BlogCategoryController from '../controllers/blog/BlogCategoryController';
import BlogCommentController from '../controllers/blog/BlogCommentController';
import { authenticate, authorize } from '../middlewares/auth/authMiddleware';
import { uploadMiddleware } from '../middlewares/upload/uploadMiddleware';

const router = Router();

// Post routes
router.get('/posts', BlogPostController.getPosts);
router.get('/posts/:id', BlogPostController.getPostById);

router.post('/posts',
    authenticate,
    authorize('admin', 'editor'),
    uploadMiddleware.single('coverImage'),
    BlogPostController.createPost
);

router.put('/posts/:id',
    authenticate,
    authorize('admin', 'editor'),
    uploadMiddleware.single('coverImage'),
    BlogPostController.updatePost
);

router.delete('/posts/:id',
    authenticate,
    authorize('admin', 'editor'),
    BlogPostController.deletePost
);

// Category routes
router.get('/categories', BlogCategoryController.getCategories);
router.get('/categories/:id', BlogCategoryController.getCategoryById);

router.post('/categories',
    authenticate,
    authorize('admin'),
    BlogCategoryController.createCategory
);

router.put('/categories/:id',
    authenticate,
    authorize('admin'),
    BlogCategoryController.updateCategory
);

router.delete('/categories/:id',
    authenticate,
    authorize('admin'),
    BlogCategoryController.deleteCategory
);

// Comment routes
router.get('/comments', BlogCommentController.getComments);

router.post('/comments',
    authenticate,
    BlogCommentController.createComment
);

router.put('/comments/:id',
    authenticate,
    BlogCommentController.updateComment
);

router.delete('/comments/:id',
    authenticate,
    BlogCommentController.deleteComment
);

router.put('/comments/:id/moderate',
    authenticate,
    authorize('admin', 'moderator'),
    BlogCommentController.moderateComment
);

export default router; 