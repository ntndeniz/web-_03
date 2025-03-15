import BlogService from '../../../domain/services/blog/BlogService';
import { validateBlogPost, validateUpdateBlogPost } from '../../validators/blog/BlogPostValidator';

class BlogPostController {
    async createPost(req, res, next) {
        try {
            const { error } = validateBlogPost(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const post = await BlogService.createPost(
                req.user.id,
                req.body,
                req.file
            );
            res.status(201).json(post);
        } catch (error) {
            next(error);
        }
    }

    async getPosts(req, res, next) {
        try {
            const filters = {
                search: req.query.search,
                categoryId: req.query.categoryId,
                authorId: req.query.authorId,
                status: req.query.status,
                tag: req.query.tag,
                startDate: req.query.startDate,
                endDate: req.query.endDate
            };

            const pagination = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10
            };

            const result = await BlogService.getPosts(filters, pagination);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getPostById(req, res, next) {
        try {
            const post = await BlogService.getPostById(req.params.id);
            res.json(post);
        } catch (error) {
            next(error);
        }
    }

    async updatePost(req, res, next) {
        try {
            const { error } = validateUpdateBlogPost(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const post = await BlogService.updatePost(
                req.params.id,
                req.user.id,
                req.body,
                req.file
            );
            res.json(post);
        } catch (error) {
            next(error);
        }
    }

    async deletePost(req, res, next) {
        try {
            await BlogService.deletePost(req.params.id, req.user.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new BlogPostController(); 