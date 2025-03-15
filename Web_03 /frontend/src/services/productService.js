import api from './api'

export default {
  async getProducts(params) {
    const response = await api.get('/products', { params })
    return response.data
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  async getCategories() {
    const response = await api.get('/categories')
    return response.data
  },

  async searchProducts(query) {
    const response = await api.get('/products/search', { params: { q: query } })
    return response.data
  },

  async getProductReviews(productId) {
    const response = await api.get(`/products/${productId}/reviews`)
    return response.data
  },

  async addProductReview(productId, reviewData) {
    const response = await api.post(`/products/${productId}/reviews`, reviewData)
    return response.data
  }
} 