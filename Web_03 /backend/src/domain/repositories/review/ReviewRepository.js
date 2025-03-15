import { Op } from 'sequelize';
import Review from '../../models/Review';
import ReviewReaction from '../../models/ReviewReaction';
import createError from 'http-errors';

class ReviewRepository {
    async create(reviewData) {
        return await Review.create(reviewData);
    }

    async findById(id) {
        const review = await Review.findByPk(id, {
            include: [
                'User',
                'Product',
                {
                    model: ReviewReaction,
                    attributes: ['type', [sequelize.fn('COUNT', '*'), 'count']],
                    group: ['type']
                }
            ]
        });

        if (!review) {
            throw createError(404, 'Review not found');
        }

        return review;
    }

    async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
        const { productId, userId, rating, isVerified, isPublished, search } = filters;
        const { page, limit } = pagination;

        const where = {};

        if (productId) where.productId = productId;
        if (userId) where.userId = userId;
        if (rating) where.rating = rating;
        if (isVerified !== undefined) where.isVerified = isVerified;
        if (isPublished !== undefined) where.isPublished = isPublished;
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { content: { [Op.iLike]: `%${search}%` } }
            ];
        }

        return await Review.findAndCountAll({
            where,
            include: ['User', 'Product'],
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']]
        });
    }

    async update(id, updateData) {
        const review = await this.findById(id);
        return await review.update(updateData);
    }

    async delete(id) {
        const review = await this.findById(id);
        await review.destroy();
        return true;
    }

    async addReaction(reviewId, userId, type) {
        const [reaction, created] = await ReviewReaction.findOrCreate({
            where: { reviewId, userId, type }
        });

        if (!created) {
            throw createError(400, 'Reaction already exists');
        }

        await this.updateReactionCount(reviewId, type);
        return reaction;
    }

    async removeReaction(reviewId, userId, type) {
        const deleted = await ReviewReaction.destroy({
            where: { reviewId, userId, type }
        });

        if (deleted) {
            await this.updateReactionCount(reviewId, type);
        }

        return deleted > 0;
    }

    async updateReactionCount(reviewId, type) {
        const count = await ReviewReaction.count({
            where: { reviewId, type }
        });

        await Review.update(
            { 
                [type === 'helpful' ? 'helpfulCount' : 'reportCount']: count 
            },
            { where: { id: reviewId } }
        );
    }
}

export default new ReviewRepository(); 