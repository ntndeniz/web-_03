import { Op } from 'sequelize';
import Order from '../../models/Order';
import OrderItem from '../../models/OrderItem';
import createError from 'http-errors';

class OrderRepository {
    async create(orderData, orderItems) {
        const transaction = await Order.sequelize.transaction();

        try {
            const order = await Order.create(orderData, { transaction });

            await OrderItem.bulkCreate(
                orderItems.map(item => ({
                    ...item,
                    orderId: order.id
                })),
                { transaction }
            );

            await transaction.commit();
            return this.findById(order.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async findById(id, userId = null) {
        const where = { id };
        if (userId) where.userId = userId;

        const order = await Order.findOne({
            where,
            include: [
                {
                    model: OrderItem,
                    include: ['Product']
                }
            ]
        });

        if (!order) {
            throw createError(404, 'Order not found');
        }

        return order;
    }

    async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
        const { userId, status, startDate, endDate } = filters;
        const { page, limit } = pagination;

        const where = {};

        if (userId) where.userId = userId;
        if (status) where.status = status;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt[Op.gte] = startDate;
            if (endDate) where.createdAt[Op.lte] = endDate;
        }

        return await Order.findAndCountAll({
            where,
            include: [
                {
                    model: OrderItem,
                    include: ['Product']
                }
            ],
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']]
        });
    }

    async updateStatus(id, status, userId = null) {
        const order = await this.findById(id, userId);
        return await order.update({ status });
    }

    async updatePaymentStatus(id, paymentStatus) {
        const order = await this.findById(id);
        return await order.update({ paymentStatus });
    }
}

export default new OrderRepository(); 