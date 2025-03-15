import ProductService from '../../../domain/services/product/ProductService';
import { validateProduct, validateUpdateProduct } from '../../validators/product/ProductValidator';
import { uploadMiddleware } from '../../middlewares/upload/uploadMiddleware';

class ProductController {
    async createProduct(req, res, next) {
        try {
            const { error } = validateProduct(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const product = await ProductService.createProduct(req.body, req.files);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    async getProducts(req, res, next) {
        try {
            const filters = {
                category: req.query.category,
                search: req.query.search,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                inStock: req.query.inStock === 'true'
            };

            const pagination = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10
            };

            const result = await ProductService.getProducts(filters, pagination);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { error } = validateUpdateProduct(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const product = await ProductService.updateProduct(
                req.params.id,
                req.body,
                req.files
            );
            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            await ProductService.deleteProduct(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductController(); 