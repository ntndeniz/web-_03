import { Op } from 'sequelize';
import Product from '../../models/Product';
import createError from 'http-errors';

class ProductRepository {
    async create(productData) {
        return await Product.create(productData);
    }

    async findById(id) {
        const product = await Product.findByPk(id);
        if (!product) {
            throw createError(404, 'Product not found');
        }
        return product;
    }

    async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
        const { category, search, minPrice, maxPrice, inStock } = filters;
        const { page, limit } = pagination;

        const where = {};

        if (category) {
            where.category = category;
        }

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = minPrice;
            if (maxPrice) where.price[Op.lte] = maxPrice;
        }

        if (inStock) {
            where.stock = { [Op.gt]: 0 };
        }

        return await Product.findAndCountAll({
            where,
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']]
        });
    }

    async update(id, updateData) {
        const product = await this.findById(id);
        return await product.update(updateData);
    }

    async delete(id) {
        const product = await this.findById(id);
        await product.destroy();
        return true;
    }

    async updateStock(id, quantity) {
        const product = await this.findById(id);
        if (product.stock < quantity) {
            throw createError(400, 'Insufficient stock');
        }
        return await product.update({ stock: product.stock - quantity });
    }
}

export default new ProductRepository(); 