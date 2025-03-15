import { Op } from 'sequelize';
import BlogPost from '../../models/BlogPost';
import createError from 'http-errors';

class BlogPostRepository {
    async create(postData) {
        return await BlogPost.create(postData);
    }

    async findById(id) {
        const post = await BlogPost.findByPk(id, {
            include: [
                { model: User, as: 'author' },
                { model: BlogCategory, as: 'category' },
                { 
                    model: BlogComment,
                    as: 'comments',
                    where: { status: 'approved' },
                    required: false
                }
            ]
        });

        if (!post) {
            throw createError(404, 'Blog post not found');
        }

        return post;
    }

    async findBySlug(slug) {
        const post = await BlogPost.findOne({
            where: { slug },
            include: [
                { model: User, as: 'author' },
                { model: BlogCategory, as: 'category' },
                { 
                    model: BlogComment,
                    as: 'comments',
                    where: { status: 'approved' },
                    required: false
                }
            ]
        });

        if (!post) {
            throw createError(404, 'Blog post not found');
        }

        return post;
    }

    async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
        const { 
            search, 
            categoryId, 
            authorId, 
            status, 
            tag,
            startDate,
            endDate 
        } = filters;
        
        const { page, limit } = pagination;

        const where = {};

        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { content: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (categoryId) where.categoryId = categoryId;
        if (authorId) where.authorId = authorId;
        if (status) where.status = status;
        if (tag) where.tags = { [Op.contains]: [tag] };
        
        if (startDate || endDate) {
            where.publishedAt = {};
            if (startDate) where.publishedAt[Op.gte] = startDate;
            if (endDate) where.publishedAt[Op.lte] = endDate;
        }

        return await BlogPost.findAndCountAll({
            where,
            include: [
                { model: User, as: 'author' },
                { model: BlogCategory, as: 'category' }
            ],
            limit,
            offset: (page - 1) * limit,
            order: [['publishedAt', 'DESC']]
        });
    }

    async update(id, updateData) {
        const post = await this.findById(id);
        return await post.update(updateData);
    }

    async delete(id) {
        const post = await this.findById(id);
        await post.destroy();
        return true;
    }

    async incrementViewCount(id) {
        return await BlogPost.increment('viewCount', { where: { id } });
    }
}

export default new BlogPostRepository(); 