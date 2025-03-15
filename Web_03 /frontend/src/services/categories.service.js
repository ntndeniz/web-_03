import api from './api'

export default {
  // Tüm kategorileri getir
  getCategories() {
    return api.get('/categories')
  },

  // Kategori detayı
  getCategoryById(id) {
    return api.get(`/categories/${id}`)
  },

  // Yeni kategori oluştur
  createCategory(data) {
    return api.post('/admin/categories', data)
  },

  // Kategori güncelle
  updateCategory(id, data) {
    return api.put(`/admin/categories/${id}`, data)
  },

  // Kategori sil
  deleteCategory(id) {
    return api.delete(`/admin/categories/${id}`)
  },

  // Kategori sırasını güncelle
  updateCategoryOrder(id, order) {
    return api.put(`/admin/categories/${id}/order`, { order })
  },

  // Kategori durumunu değiştir
  toggleCategoryStatus(id) {
    return api.put(`/admin/categories/${id}/toggle`)
  }
} 