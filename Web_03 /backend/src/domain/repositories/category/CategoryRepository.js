import { Op } from 'sequelize';
import Category from '../../models/Category';
import createError from 'http-errors';

class CategoryRepository {
    async create(categoryData) {
        return await Category.create(categoryData);
    }

    async findById(id) {
        const category = await Category.findByPk(id, {
            include: [
                { model: Category, as: 'children' },
                { model: Category, as: 'parent' }
            ]
        });

        if (!category) {
            throw createError(404, 'Category not found');
        }

        return category;
    }

    async findBySlug(slug) {
        const category = await Category.findOne({
            where: { slug },
            include: [
                { model: Category, as: 'children' },
                { model: Category, as: 'parent' }
            ]
        });

        if (!category) {
            throw createError(404, 'Category not found');
        }

        return category;
    }

    async findAll(filters = {}) {
        const { search, parentId, isActive } = filters;
        const where = {};

        if (search) {
            where.name = { [Op.iLike]: `%${search}%` };
        }

        if (parentId !== undefined) {
            where.parentId = parentId;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        return await Category.findAll({
            where,
            include: [
                { model: Category, as: 'children' }
            ],
            order: [
                ['order', 'ASC'],
                ['name', 'ASC']
            ]
        });
    }

    async update(id, updateData) {
        const category = await this.findById(id);
        return await category.update(updateData);
    }

    async delete(id) {
        const category = await this.findById(id);
        
        // Alt kategorileri kontrol et
        const hasChildren = await Category.count({ where: { parentId: id } });
        if (hasChildren) {
            throw createError(400, 'Cannot delete category with subcategories');
        }

        // Kategoriye bağlı ürünleri kontrol et
        const hasProducts = await category.countProducts();
        if (hasProducts) {
            throw createError(400, 'Cannot delete category with products');
        }

        await category.destroy();
        return true;
    }

    async reorder(categories) {
        const transaction = await Category.sequelize.transaction();

        try {
            for (const { id, order } of categories) {
                await Category.update(
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

export default new CategoryRepository(); 