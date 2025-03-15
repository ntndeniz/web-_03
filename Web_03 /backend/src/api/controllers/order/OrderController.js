import OrderService from '../../../domain/services/order/OrderService';
import { validateOrder } from '../../validators/order/OrderValidator';

class OrderController {
    async createOrder(req, res, next) {
        try {
            const { error } = validateOrder(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const order = await OrderService.createOrder(req.user.id, req.body);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }

    async getOrders(req, res, next) {
        try {
            const filters = {
                userId: req.user.role === 'admin' ? req.query.userId : req.user.id,
                status: req.query.status,
                startDate: req.query.startDate,
                endDate: req.query.endDate
            };

            const pagination = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10
            };

            const result = await OrderService.getOrders(filters, pagination);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getOrderById(req, res, next) {
        try {
            const userId = req.user.role === 'admin' ? null : req.user.id;
            const order = await OrderService.getOrderById(req.params.id, userId);
            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async updateOrderStatus(req, res, next) {
        try {
            const order = await OrderService.updateOrderStatus(
                req.params.id,
                req.body.status,
                req.user.role === 'admin' ? null : req.user.id
            );
            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async cancelOrder(req, res, next) {
        try {
            const order = await OrderService.cancelOrder(req.params.id, req.user.id);
            res.json(order);
        } catch (error) {
            next(error);
        }
    }
}

export default new OrderController(); 