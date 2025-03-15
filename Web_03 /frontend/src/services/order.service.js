import ApiService from './api.service';

const OrderService = {
  // Sipariş listeleme
  getOrders(params) {
    return ApiService.get('/orders', { params });
  },

  // Sipariş detayı
  getOrderById(id) {
    return ApiService.get(`/orders/${id}`);
  },

  // Yeni sipariş oluşturma
  createOrder(orderData) {
    return ApiService.post('/orders', orderData);
  },

  // Sipariş güncelleme
  updateOrder(id, orderData) {
    return ApiService.put(`/orders/${id}`, orderData);
  },

  // Sipariş iptal etme
  cancelOrder(id) {
    return ApiService.post(`/orders/${id}/cancel`);
  },

  // Sipariş iade talebi
  createReturnRequest(orderId, returnData) {
    return ApiService.post(`/orders/${orderId}/return`, returnData);
  },

  // İade talebi durumu
  getReturnStatus(orderId, returnId) {
    return ApiService.get(`/orders/${orderId}/return/${returnId}`);
  },

  // Fatura indirme
  downloadInvoice(orderId) {
    return ApiService.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob'
    });
  },

  // Kargo takibi
  getShipmentTracking(orderId) {
    return ApiService.get(`/orders/${orderId}/tracking`);
  },

  // Teslimat onayı
  confirmDelivery(orderId) {
    return ApiService.post(`/orders/${orderId}/confirm-delivery`);
  },

  // Sipariş değerlendirmesi
  submitReview(orderId, reviewData) {
    return ApiService.post(`/orders/${orderId}/review`, reviewData);
  }
};

export default OrderService; 