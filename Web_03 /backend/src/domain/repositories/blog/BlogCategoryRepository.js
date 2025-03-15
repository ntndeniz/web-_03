import { Op } from 'sequelize';
import BlogCategory from '../../models/BlogCategory';
import createError from 'http-errors';

class BlogCategoryRepository {
    async create(categoryData) {
        return await BlogCategory.create(categoryData);
    }

    async findById(id) {
        const category = await BlogCategory.findByPk(id, {
            include: [
                { model: BlogCategory, as: 'children' },
                { model: BlogCategory, as: 'parent' }
            ]
        });

        if (!category) {
            throw createError(404, 'Blog category not found');
        }

        return category;
    }

    async findBySlug(slug) {
        const category = await BlogCategory.findOne({
            where: { slug },
            include: [
                { model: BlogCategory, as: 'children' },
                { model: BlogCategory, as: 'parent' }
            ]
        });

        if (!category) {
            throw createError(404, 'Blog category not found');
        }

        return category;
    }

    async findAll(filters = {}) {
        const { search, parentId } = filters;
        const where = {};

        if (search) {
            where.name = { [Op.iLike]: `%${search}%` };
        }

        if (parentId !== undefined) {
            where.parentId = parentId;
        }

        return await BlogCategory.findAll({
            where,
            include: [{ model: BlogCategory, as: 'children' }],
            order: [['order', 'ASC'], ['name', 'ASC']]
        });
    }

    async update(id, updateData) {
        const category = await this.findById(id);
        return await category.update(updateData);
    }

    async delete(id) {
        const category = await this.findById(id);
        
        const hasChildren = await BlogCategory.count({ where: { parentId: id } });
        if (hasChildren) {
            throw createError(400, 'Cannot delete category with subcategories');
        }

        const hasPosts = await category.countBlogPosts();
        if (hasPosts) {
            throw createError(400, 'Cannot delete category with posts');
        }

        await category.destroy();
        return true;
    }

    async reorder(categories) {
        const transaction = await BlogCategory.sequelize.transaction();

        try {
            for (const { id, order } of categories) {
                await BlogCategory.update(
                    { order },
                    { where: { id }, transaction }
                );
            }

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

export default new BlogCategoryRepository(); 