import OrderRepository from '../../repositories/order/OrderRepository';
import ProductService from '../product/ProductService';
import PaymentService from '../payment/PaymentService';
import { EventEmitter } from '../../../core/events/EventEmitter';
import createError from 'http-errors';

class OrderService {
    constructor() {
        this.orderRepository = OrderRepository;
    }

    async createOrder(userId, orderData) {
        // Stok kontrolü
        for (const item of orderData.items) {
            const hasStock = await ProductService.checkStock(item.productId, item.quantity);
            if (!hasStock) {
                throw createError(400, `Insufficient stock for product ${item.productId}`);
            }
        }

        // Toplam tutarı hesapla
        const totalAmount = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = await this.orderRepository.create({
            userId,
            totalAmount,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethod
        }, orderData.items);

        // Stok güncelleme
        for (const item of orderData.items) {
            await ProductService.updateStock(item.productId, item.quantity);
        }

        // Ödeme işlemi
        if (orderData.paymentMethod === 'credit_card') {
            await PaymentService.processPayment(order);
        }

        EventEmitter.emit('order.created', order);

        return order;
    }

    async getOrders(filters, pagination) {
        const { rows: orders, count } = await this.orderRepository.findAll(filters, pagination);
        
        return {
            orders,
            pagination: {
                total: count,
                page: pagination.page,
                limit: pagination.limit,
                pages: Math.ceil(count / pagination.limit)
            }
        };
    }

    async getOrderById(id, userId = null) {
        return await this.orderRepository.findById(id, userId);
    }

    async updateOrderStatus(id, status, userId = null) {
        const order = await this.orderRepository.updateStatus(id, status, userId);
        EventEmitter.emit('order.statusUpdated', order);
        return order;
    }

    async cancelOrder(id, userId) {
        const order = await this.getOrderById(id, userId);
        
        if (order.status !== 'pending') {
            throw createError(400, 'Order cannot be cancelled');
        }

        // Stok iade
        for (const item of order.OrderItems) {
            await ProductService.updateStock(item.productId, -item.quantity);
        }

        const updatedOrder = await this.updateOrderStatus(id, 'cancelled', userId);
        EventEmitter.emit('order.cancelled', updatedOrder);

        return updatedOrder;
    }
}

export default new OrderService(); 