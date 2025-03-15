import BlogService from '../../../domain/services/blog/BlogService';
import { validateBlogCategory } from '../../validators/blog/BlogCategoryValidator';

class BlogCategoryController {
    async createCategory(req, res, next) {
        try {
            const { error } = validateBlogCategory(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const category = await BlogService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }

    async getCategories(req, res, next) {
        try {
            const filters = {
                search: req.query.search,
                parentId: req.query.parentId
            };

            const categories = await BlogService.getCategories(filters);
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }

    async getCategoryById(req, res, next) {
        try {
            const category = await BlogService.getCategoryById(req.params.id);
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const { error } = validateBlogCategory(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const category = await BlogService.updateCategory(req.params.id, req.body);
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            await BlogService.deleteCategory(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new BlogCategoryController(); 