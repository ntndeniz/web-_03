import api from './api'

export default {
  // Siparişler
  getOrders(params) {
    return api.get('/admin/orders', { params })
  },
  getOrderById(id) {
    return api.get(`/admin/orders/${id}`)
  },
  updateOrderStatus(id, status) {
    return api.put(`/admin/orders/${id}/status`, { status })
  },

  // Ürünler
  getProducts(params) {
    return api.get('/admin/products', { params })
  },
  createProduct(data) {
    return api.post('/admin/products', data)
  },
  updateProduct(id, data) {
    return api.put(`/admin/products/${id}`, data)
  },
  deleteProduct(id) {
    return api.delete(`/admin/products/${id}`)
  },

  // Ayarlar
  getSettings() {
    return api.get('/admin/settings')
  },
  updateSettings(data) {
    return api.put('/admin/settings', data)
  }
} 