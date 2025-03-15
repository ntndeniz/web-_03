import ProductRepository from '../../repositories/product/ProductRepository';
import { uploadImage, deleteImage } from '../../../infrastructure/storage/imageService';
import createError from 'http-errors';
import { EventEmitter } from '../../../core/events/EventEmitter';

class ProductService {
    constructor() {
        this.productRepository = ProductRepository;
    }

    async createProduct(productData, images) {
        try {
            // Resimleri yükle
            const imageUrls = await Promise.all(
                images.map(image => uploadImage(image, 'products'))
            );

            const product = await this.productRepository.create({
                ...productData,
                images: imageUrls
            });

            // Ürün oluşturuldu eventi
            EventEmitter.emit('product.created', product);

            return product;
        } catch (error) {
            // Hata durumunda yüklenen resimleri sil
            await Promise.all(imageUrls.map(url => deleteImage(url)));
            throw error;
        }
    }

    async getProducts(filters, pagination) {
        const { rows: products, count } = await this.productRepository.findAll(filters, pagination);
        
        return {
            products,
            pagination: {
                total: count,
                page: pagination.page,
                limit: pagination.limit,
                pages: Math.ceil(count / pagination.limit)
            }
        };
    }

    async getProductById(id) {
        return await this.productRepository.findById(id);
    }

    async updateProduct(id, updateData, newImages = []) {
        const product = await this.productRepository.findById(id);

        if (newImages.length > 0) {
            // Eski resimleri sil
            await Promise.all(product.images.map(url => deleteImage(url)));

            // Yeni resimleri yükle
            const imageUrls = await Promise.all(
                newImages.map(image => uploadImage(image, 'products'))
            );

            updateData.images = imageUrls;
        }

        const updatedProduct = await this.productRepository.update(id, updateData);
        EventEmitter.emit('product.updated', updatedProduct);

        return updatedProduct;
    }

    async deleteProduct(id) {
        const product = await this.productRepository.findById(id);
        
        // Resimleri sil
        await Promise.all(product.images.map(url => deleteImage(url)));
        
        await this.productRepository.delete(id);
        EventEmitter.emit('product.deleted', id);

        return true;
    }

    async checkStock(id, quantity) {
        const product = await this.productRepository.findById(id);
        return product.stock >= quantity;
    }

    async updateStock(id, quantity) {
        const product = await this.productRepository.updateStock(id, quantity);
        
        if (product.stock < 10) {
            EventEmitter.emit('product.lowStock', product);
        }

        return product;
    }
}

export default new ProductService(); 