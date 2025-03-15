import CategoryService from '../../../domain/services/category/CategoryService';
import { validateCategory, validateUpdateCategory } from '../../validators/category/CategoryValidator';

class CategoryController {
    async createCategory(req, res, next) {
        try {
            const { error } = validateCategory(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const category = await CategoryService.createCategory(req.body, req.file);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }

    async getCategories(req, res, next) {
        try {
            const filters = {
                search: req.query.search,
                parentId: req.query.parentId,
                isActive: req.query.isActive === 'true'
            };

            const categories = await CategoryService.getCategories(filters);
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }

    async getCategoryById(req, res, next) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async getCategoryBySlug(req, res, next) {
        try {
            const category = await CategoryService.getCategoryBySlug(req.params.slug);
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const { error } = validateUpdateCategory(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const category = await CategoryService.updateCategory(
                req.params.id,
                req.body,
                req.file
            );
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            await CategoryService.deleteCategory(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async reorderCategories(req, res, next) {
        try {
            await CategoryService.reorderCategories(req.body.categories);
            res.status(200).json({ message: 'Categories reordered successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export default new CategoryController(); 