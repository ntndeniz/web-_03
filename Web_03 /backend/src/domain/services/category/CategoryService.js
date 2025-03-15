import CategoryRepository from '../../repositories/category/CategoryRepository';
import { uploadImage, deleteImage } from '../../../infrastructure/storage/imageService';
import { EventEmitter } from '../../../core/events/EventEmitter';
import { Cache } from '../../../core/cache/Cache';

class CategoryService {
    constructor() {
        this.categoryRepository = CategoryRepository;
        this.cacheKey = 'categories';
    }

    async createCategory(categoryData, image) {
        try {
            if (image) {
                const imageUrl = await uploadImage(image, 'categories');
                categoryData.image = imageUrl;
            }

            const category = await this.categoryRepository.create(categoryData);
            
            await this.clearCache();
            EventEmitter.emit('category.created', category);

            return category;
        } catch (error) {
            if (categoryData.image) {
                await deleteImage(categoryData.image);
            }
            throw error;
        }
    }

    async getCategories(filters = {}) {
        const cacheKey = `${this.cacheKey}_${JSON.stringify(filters)}`;
        const cached = await Cache.get(cacheKey);

        if (cached) {
            return cached;
        }

        const categories = await this.categoryRepository.findAll(filters);
        await Cache.set(cacheKey, categories, 3600); // 1 saat cache

        return categories;
    }

    async getCategoryById(id) {
        const cacheKey = `${this.cacheKey}_${id}`;
        const cached = await Cache.get(cacheKey);

        if (cached) {
            return cached;
        }

        const category = await this.categoryRepository.findById(id);
        await Cache.set(cacheKey, category, 3600);

        return category;
    }

    async getCategoryBySlug(slug) {
        const cacheKey = `${this.cacheKey}_slug_${slug}`;
        const cached = await Cache.get(cacheKey);

        if (cached) {
            return cached;
        }

        const category = await this.categoryRepository.findBySlug(slug);
        await Cache.set(cacheKey, category, 3600);

        return category;
    }

    async updateCategory(id, updateData, newImage) {
        const category = await this.categoryRepository.findById(id);

        if (newImage) {
            if (category.image) {
                await deleteImage(category.image);
            }
            const imageUrl = await uploadImage(newImage, 'categories');
            updateData.image = imageUrl;
        }

        const updatedCategory = await this.categoryRepository.update(id, updateData);
        
        await this.clearCache();
        EventEmitter.emit('category.updated', updatedCategory);

        return updatedCategory;
    }

    async deleteCategory(id) {
        const category = await this.categoryRepository.findById(id);
        
        if (category.image) {
            await deleteImage(category.image);
        }

        await this.categoryRepository.delete(id);
        
        await this.clearCache();
        EventEmitter.emit('category.deleted', id);

        return true;
    }

    async reorderCategories(categories) {
        await this.categoryRepository.reorder(categories);
        await this.clearCache();
        EventEmitter.emit('category.reordered', categories);
    }

    async clearCache() {
        const keys = await Cache.keys(`${this.cacheKey}*`);
        await Promise.all(keys.map(key => Cache.del(key)));
    }
}

export default new CategoryService(); 