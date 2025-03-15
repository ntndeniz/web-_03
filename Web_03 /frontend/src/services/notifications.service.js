import api from './api'

export default {
  // Bildirimleri getir
  getNotifications(params) {
    return api.get('/notifications', { params })
  },

  // Okunmamış bildirim sayısı
  getUnreadCount() {
    return api.get('/notifications/unread/count')
  },

  // Bildirimi okundu olarak işaretle
  markAsRead(id) {
    return api.put(`/notifications/${id}/read`)
  },

  // Tüm bildirimleri okundu olarak işaretle
  markAllAsRead() {
    return api.put('/notifications/read-all')
  },

  // Bildirim ayarlarını getir
  getSettings() {
    return api.get('/notifications/settings')
  },

  // Bildirim ayarlarını güncelle
  updateSettings(data) {
    return api.put('/notifications/settings', data)
  },

  // Push notification token'ı kaydet
  savePushToken(token) {
    return api.post('/notifications/push-token', { token })
  },

  // Push notification token'ı sil
  deletePushToken(token) {
    return api.delete('/notifications/push-token', { data: { token } })
  }
} 