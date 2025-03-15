import { Router } from 'express';
import ReviewController from '../controllers/review/ReviewController';
import { authenticate } from '../middlewares/auth/authMiddleware';
import { uploadMiddleware } from '../middlewares/upload/uploadMiddleware';

const router = Router();

// Public routes
router.get('/', ReviewController.getReviews);
router.get('/:id', ReviewController.getReviewById);

// Authenticated routes
router.post('/',
    authenticate,
    uploadMiddleware.array('images', 5),
    ReviewController.createReview
);

router.put('/:id',
    authenticate,
    uploadMiddleware.array('images', 5),
    ReviewController.updateReview
);

router.delete('/:id',
    authenticate,
    ReviewController.deleteReview
);

// Reaction routes
router.post('/:id/reactions',
    authenticate,
    ReviewController.addReaction
);

router.delete('/:id/reactions',
    authenticate,
    ReviewController.removeReaction
);

export default router; 