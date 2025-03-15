import { Router } from 'express';
import OrderController from '../controllers/order/OrderController';
import { authenticate, authorize } from '../middlewares/auth/authMiddleware';

const router = Router();

// Kullanıcı rotaları
router.post('/', authenticate, OrderController.createOrder);
router.get('/my-orders', authenticate, OrderController.getOrders);
router.get('/my-orders/:id', authenticate, OrderController.getOrderById);
router.post('/my-orders/:id/cancel', authenticate, OrderController.cancelOrder);

// Admin rotaları
router.get('/', 
    authenticate, 
    authorize('admin'), 
    OrderController.getOrders
);
router.get('/:id', 
    authenticate, 
    authorize('admin'), 
    OrderController.getOrderById
);
router.put('/:id/status', 
    authenticate, 
    authorize('admin'), 
    OrderController.updateOrderStatus
);

export default router; 