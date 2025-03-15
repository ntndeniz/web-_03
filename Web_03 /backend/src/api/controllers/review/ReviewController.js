import ReviewService from '../../../domain/services/review/ReviewService';
import { validateReview, validateUpdateReview } from '../../validators/review/ReviewValidator';

class ReviewController {
    async createReview(req, res, next) {
        try {
            const { error } = validateReview(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const review = await ReviewService.createReview(
                req.user.id,
                req.body,
                req.files
            );
            res.status(201).json(review);
        } catch (error) {
            next(error);
        }
    }

    async getReviews(req, res, next) {
        try {
            const filters = {
                productId: req.query.productId,
                userId: req.query.userId,
                rating: req.query.rating,
                isVerified: req.query.isVerified === 'true',
                isPublished: req.query.isPublished === 'true',
                search: req.query.search
            };

            const pagination = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10
            };

            const result = await ReviewService.getReviews(filters, pagination);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getReviewById(req, res, next) {
        try {
            const review = await ReviewService.getReviewById(req.params.id);
            res.json(review);
        } catch (error) {
            next(error);
        }
    }

    async updateReview(req, res, next) {
        try {
            const { error } = validateUpdateReview(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const review = await ReviewService.updateReview(
                req.params.id,
                req.user.id,
                req.body,
                req.files
            );
            res.json(review);
        } catch (error) {
            next(error);
        }
    }

    async deleteReview(req, res, next) {
        try {
            await ReviewService.deleteReview(req.params.id, req.user.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async addReaction(req, res, next) {
        try {
            const reaction = await ReviewService.addReaction(
                req.params.id,
                req.user.id,
                req.body.type
            );
            res.status(201).json(reaction);
        } catch (error) {
            next(error);
        }
    }

    async removeReaction(req, res, next) {
        try {
            await ReviewService.removeReaction(
                req.params.id,
                req.user.id,
                req.body.type
            );
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new ReviewController(); 