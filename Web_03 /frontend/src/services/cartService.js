import api from './api'

export default {
  async getCart() {
    const response = await api.get('/cart')
    return response.data
  },

  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart/items', { productId, quantity })
    return response.data
  },

  async updateCartItem(itemId, quantity) {
    const response = await api.put(`/cart/items/${itemId}`, { quantity })
    return response.data
  },

  async removeFromCart(itemId) {
    const response = await api.delete(`/cart/items/${itemId}`)
    return response.data
  },

  async clearCart() {
    const response = await api.delete('/cart')
    return response.data
  },

  async applyCoupon(code) {
    const response = await api.post('/cart/coupon', { code })
    return response.data
  },

  async removeCoupon() {
    const response = await api.delete('/cart/coupon')
    return response.data
  }
} 