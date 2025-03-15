import ApiService from './api.service';

const NotificationService = {
  // Bildirimleri listeleme
  getNotifications(params) {
    return ApiService.get('/notifications', { params });
  },

  // Bildirim detayı
  getNotificationById(id) {
    return ApiService.get(`/notifications/${id}`);
  },

  // Bildirim okundu olarak işaretleme
  markAsRead(id) {
    return ApiService.put(`/notifications/${id}/read`);
  },

  // Tüm bildirimleri okundu olarak işaretleme
  markAllAsRead() {
    return ApiService.put('/notifications/read-all');
  },

  // Bildirim silme
  deleteNotification(id) {
    return ApiService.delete(`/notifications/${id}`);
  },

  // Bildirim tercihlerini güncelleme
  updatePreferences(preferences) {
    return ApiService.put('/notifications/preferences', preferences);
  },

  // Push notification token kaydetme
  savePushToken(token) {
    return ApiService.post('/notifications/push-token', { token });
  },

  // Push notification token silme
  deletePushToken(token) {
    return ApiService.delete('/notifications/push-token', { data: { token } });
  }
};

export default NotificationService; 