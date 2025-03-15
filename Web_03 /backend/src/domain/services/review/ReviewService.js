import ReviewRepository from '../../repositories/review/ReviewRepository';
import { uploadImage, deleteImage } from '../../../infrastructure/storage/imageService';
import { EventEmitter } from '../../../core/events/EventEmitter';
import createError from 'http-errors';

class ReviewService {
    constructor() {
        this.reviewRepository = ReviewRepository;
    }

    async createReview(userId, reviewData, images = []) {
        // Sipariş kontrolü
        const hasOrder = await this.verifyOrderAndProduct(userId, reviewData.productId);
        if (!hasOrder) {
            throw createError(400, 'You can only review products you have purchased');
        }

        // Önceki yorum kontrolü
        const existingReview = await this.reviewRepository.findAll({
            userId,
            productId: reviewData.productId
        });

        if (existingReview.count > 0) {
            throw createError(400, 'You have already reviewed this product');
        }

        try {
            // Resimleri yükle
            const imageUrls = await Promise.all(
                images.map(image => uploadImage(image, 'reviews'))
            );

            const review = await this.reviewRepository.create({
                ...reviewData,
                userId,
                images: imageUrls
            });

            EventEmitter.emit('review.created', review);
            return review;
        } catch (error) {
            // Hata durumunda yüklenen resimleri sil
            await Promise.all(imageUrls.map(url => deleteImage(url)));
            throw error;
        }
    }

    async getReviews(filters, pagination) {
        const { rows: reviews, count } = await this.reviewRepository.findAll(filters, pagination);
        
        return {
            reviews,
            pagination: {
                total: count,
                page: pagination.page,
                limit: pagination.limit,
                pages: Math.ceil(count / pagination.limit)
            }
        };
    }

    async getReviewById(id) {
        return await this.reviewRepository.findById(id);
    }

    async updateReview(id, userId, updateData, newImages = []) {
        const review = await this.reviewRepository.findById(id);

        if (review.userId !== userId) {
            throw createError(403, 'You can only update your own reviews');
        }

        try {
            if (newImages.length > 0) {
                // Eski resimleri sil
                await Promise.all(review.images.map(url => deleteImage(url)));

                // Yeni resimleri yükle
                const imageUrls = await Promise.all(
                    newImages.map(image => uploadImage(image, 'reviews'))
                );

                updateData.images = imageUrls;
            }

            const updatedReview = await this.reviewRepository.update(id, updateData);
            EventEmitter.emit('review.updated', updatedReview);

            return updatedReview;
        } catch (error) {
            if (updateData.images) {
                await Promise.all(updateData.images.map(url => deleteImage(url)));
            }
            throw error;
        }
    }

    async deleteReview(id, userId) {
        const review = await this.reviewRepository.findById(id);

        if (review.userId !== userId) {
            throw createError(403, 'You can only delete your own reviews');
        }

        // Resimleri sil
        await Promise.all(review.images.map(url => deleteImage(url)));

        await this.reviewRepository.delete(id);
        EventEmitter.emit('review.deleted', id);

        return true;
    }

    async addReaction(reviewId, userId, type) {
        const reaction = await this.reviewRepository.addReaction(reviewId, userId, type);
        EventEmitter.emit('review.reaction.added', { reviewId, userId, type });
        return reaction;
    }

    async removeReaction(reviewId, userId, type) {
        const result = await this.reviewRepository.removeReaction(reviewId, userId, type);
        if (result) {
            EventEmitter.emit('review.reaction.removed', { reviewId, userId, type });
        }
        return result;
    }

    async verifyOrderAndProduct(userId, productId) {
        // Kullanıcının bu ürünü satın alıp almadığını kontrol et
        const order = await Order.findOne({
            include: [{
                model: OrderItem,
                where: { productId }
            }],
            where: {
                userId,
                status: 'delivered'
            }
        });

        return !!order;
    }
}

export default new ReviewService(); 