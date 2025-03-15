import { Op } from 'sequelize';
import BlogComment from '../../models/BlogComment';
import createError from 'http-errors';

class BlogCommentRepository {
    async create(commentData) {
        return await BlogComment.create(commentData);
    }

    async findById(id) {
        const comment = await BlogComment.findByPk(id, {
            include: [
                { model: User, as: 'author' },
                { 
                    model: BlogComment,
                    as: 'replies',
                    include: [{ model: User, as: 'author' }]
                }
            ]
        });

        if (!comment) {
            throw createError(404, 'Comment not found');
        }

        return comment;
    }

    async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
        const { postId, userId, status, search } = filters;
        const { page, limit } = pagination;

        const where = {};

        if (postId) where.postId = postId;
        if (userId) where.userId = userId;
        if (status) where.status = status;
        if (search) {
            where.content = { [Op.iLike]: `%${search}%` };
        }

        return await BlogComment.findAndCountAll({
            where,
            include: [
                { model: User, as: 'author' },
                { 
                    model: BlogComment,
                    as: 'replies',
                    include: [{ model: User, as: 'author' }]
                }
            ],
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']]
        });
    }

    async update(id, updateData) {
        const comment = await this.findById(id);
        return await comment.update({
            ...updateData,
            isEdited: true
        });
    }

    async delete(id) {
        const comment = await this.findById(id);
        await comment.destroy();
        return true;
    }

    async updateStatus(id, status) {
        const comment = await this.findById(id);
        return await comment.update({ status });
    }

    async getReplies(commentId, pagination = { page: 1, limit: 10 }) {
        const { page, limit } = pagination;

        return await BlogComment.findAndCountAll({
            where: { parentId: commentId },
            include: [{ model: User, as: 'author' }],
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'ASC']]
        });
    }
}

export default new BlogCommentRepository(); 