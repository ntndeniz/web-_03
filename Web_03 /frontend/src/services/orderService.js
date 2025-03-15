import api from './api'

export default {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  async getOrders(params) {
    const response = await api.get('/orders', { params })
    return response.data
  },

  async getOrderById(orderId) {
    const response = await api.get(`/orders/${orderId}`)
    return response.data
  },

  async cancelOrder(orderId) {
    const response = await api.post(`/orders/${orderId}/cancel`)
    return response.data
  },

  async getOrderTracking(orderId) {
    const response = await api.get(`/orders/${orderId}/tracking`)
    return response.data
  },

  async confirmDelivery(orderId) {
    const response = await api.post(`/orders/${orderId}/confirm-delivery`)
    return response.data
  },

  async requestReturn(orderId, returnData) {
    const response = await api.post(`/orders/${orderId}/return`, returnData)
    return response.data
  }
} 