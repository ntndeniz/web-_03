import api from './api'

export default {
  // Aktif kampanyaları getir
  getActiveCampaigns() {
    return api.get('/campaigns/active')
  },

  // Tüm kampanyaları getir (admin)
  getAllCampaigns(params) {
    return api.get('/admin/campaigns', { params })
  },

  // Kampanya detayı
  getCampaignById(id) {
    return api.get(`/admin/campaigns/${id}`)
  },

  // Yeni kampanya oluştur
  createCampaign(data) {
    return api.post('/admin/campaigns', data)
  },

  // Kampanya güncelle
  updateCampaign(id, data) {
    return api.put(`/admin/campaigns/${id}`, data)
  },

  // Kampanya sil
  deleteCampaign(id) {
    return api.delete(`/admin/campaigns/${id}`)
  },

  // Kampanya durumunu değiştir
  toggleCampaignStatus(id) {
    return api.put(`/admin/campaigns/${id}/toggle`)
  },

  // Kampanya görselini yükle
  uploadCampaignImage(id, file) {
    const formData = new FormData()
    formData.append('image', file)
    
    return api.post(`/admin/campaigns/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
} 