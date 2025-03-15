import BlogService from '../../../domain/services/blog/BlogService';
import { validateBlogComment } from '../../validators/blog/BlogCommentValidator';

class BlogCommentController {
    async createComment(req, res, next) {
        try {
            const { error } = validateBlogComment(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const comment = await BlogService.createComment(req.user.id, req.body);
            res.status(201).json(comment);
        } catch (error) {
            next(error);
        }
    }

    async getComments(req, res, next) {
        try {
            const filters = {
                postId: req.query.postId,
                userId: req.query.userId,
                status: req.query.status,
                search: req.query.search
            };

            const pagination = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10
            };

            const result = await BlogService.getComments(filters, pagination);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateComment(req, res, next) {
        try {
            const { error } = validateBlogComment(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const comment = await BlogService.updateComment(
                req.params.id,
                req.user.id,
                req.body
            );
            res.json(comment);
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(req, res, next) {
        try {
            await BlogService.deleteComment(req.params.id, req.user.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async moderateComment(req, res, next) {
        try {
            const comment = await BlogService.updateCommentStatus(
                req.params.id,
                req.body.status
            );
            res.json(comment);
        } catch (error) {
            next(error);
        }
    }
}

export default new BlogCommentController(); 