import BlogPostRepository from '../../repositories/blog/BlogPostRepository';
import BlogCategoryRepository from '../../repositories/blog/BlogCategoryRepository';
import BlogCommentRepository from '../../repositories/blog/BlogCommentRepository';
import { uploadImage, deleteImage } from '../../../infrastructure/storage/imageService';
import { EventEmitter } from '../../../core/events/EventEmitter';
import { Cache } from '../../../core/cache/Cache';
import createError from 'http-errors';

class BlogService {
    constructor() {
        this.postRepository = BlogPostRepository;
        this.categoryRepository = BlogCategoryRepository;
        this.commentRepository = BlogCommentRepository;
        this.cacheKeyPrefix = 'blog';
    }

    // Post methods
    async createPost(authorId, postData, coverImage) {
        try {
            if (coverImage) {
                const imageUrl = await uploadImage(coverImage, 'blog/covers');
                postData.coverImage = imageUrl;
            }

            const post = await this.postRepository.create({
                ...postData,
                authorId
            });

            await this.clearCache('posts');
            EventEmitter.emit('blog.post.created', post);

            return post;
        } catch (error) {
            if (postData.coverImage) {
                await deleteImage(postData.coverImage);
            }
            throw error;
        }
    }

    async getPosts(filters, pagination) {
        const cacheKey = `${this.cacheKeyPrefix}:posts:${JSON.stringify(filters)}:${JSON.stringify(pagination)}`;
        const cached = await Cache.get(cacheKey);

        if (cached) {
            return cached;
        }

        const { rows: posts, count } = await this.postRepository.findAll(filters, pagination);
        
        const result = {
            posts,
            pagination: {
                total: count,
                page: pagination.page,
                limit: pagination.limit,
                pages: Math.ceil(count / pagination.limit)
            }
        };

        await Cache.set(cacheKey, result, 3600); // 1 saat cache
        return result;
    }

    async getPostById(id) {
        const cacheKey = `${this.cacheKeyPrefix}:post:${id}`;
        const cached = await Cache.get(cacheKey);

        if (cached) {
            return cached;
        }

        const post = await this.postRepository.findById(id);
        await Cache.set(cacheKey, post, 3600);
        return post;
    }

    async updatePost(id, authorId, updateData, newCoverImage) {
        const post = await this.postRepository.findById(id);

        if (post.authorId !== authorId) {
            throw createError(403, 'You can only update your own posts');
        }

        try {
            if (newCoverImage) {
                if (post.coverImage) {
                    await deleteImage(post.coverImage);
                }
                const imageUrl = await uploadImage(newCoverImage, 'blog/covers');
                updateData.coverImage = imageUrl;
            }

            const updatedPost = await this.postRepository.update(id, updateData);
            
            await this.clearCache('posts');
            await this.clearCache(`post:${id}`);
            EventEmitter.emit('blog.post.updated', updatedPost);

            return updatedPost;
        } catch (error) {
            if (updateData.coverImage) {
                await deleteImage(updateData.coverImage);
            }
            throw error;
        }
    }

    async deletePost(id, authorId) {
        const post = await this.postRepository.findById(id);

        if (post.authorId !== authorId) {
            throw createError(403, 'You can only delete your own posts');
        }

        if (post.coverImage) {
            await deleteImage(post.coverImage);
        }

        await this.postRepository.delete(id);
        
        await this.clearCache('posts');
        await this.clearCache(`post:${id}`);
        EventEmitter.emit('blog.post.deleted', id);

        return true;
    }

    // Category methods
    async createCategory(categoryData) {
        const category = await this.categoryRepository.create(categoryData);
        await this.clearCache('categories');
        EventEmitter.emit('blog.category.created', category);
        return category;
    }

    async getCategories(filters) {
        const cacheKey = `${this.cacheKeyPrefix}:categories:${JSON.stringify(filters)}`;
        const cached = await Cache.get(cacheKey);

        if (cached) {
            return cached;
        }

        const categories = await this.categoryRepository.findAll(filters);
        await Cache.set(cacheKey, categories, 3600);
        return categories;
    }

    // Comment methods
    async createComment(userId, commentData) {
        const comment = await this.commentRepository.create({
            ...commentData,
            userId
        });

        EventEmitter.emit('blog.comment.created', comment);
        return comment;
    }

    async getComments(filters, pagination) {
        return await this.commentRepository.findAll(filters, pagination);
    }

    async updateComment(id, userId, updateData) {
        const comment = await this.commentRepository.findById(id);

        if (comment.userId !== userId) {
            throw createError(403, 'You can only update your own comments');
        }

        const updatedComment = await this.commentRepository.update(id, updateData);
        EventEmitter.emit('blog.comment.updated', updatedComment);
        return updatedComment;
    }

    async deleteComment(id, userId) {
        const comment = await this.commentRepository.findById(id);

        if (comment.userId !== userId) {
            throw createError(403, 'You can only delete your own comments');
        }

        await this.commentRepository.delete(id);
        EventEmitter.emit('blog.comment.deleted', id);
        return true;
    }

    // Cache methods
    async clearCache(pattern) {
        const keys = await Cache.keys(`${this.cacheKeyPrefix}:${pattern}*`);
        await Promise.all(keys.map(key => Cache.del(key)));
    }
}

export default new BlogService(); 