import api from './api'

export default {
  async getNotifications() {
    const response = await api.get('/notifications')
    return response.data
  },

  async markAsRead(notificationId) {
    const response = await api.put(`/notifications/${notificationId}/read`)
    return response.data
  },

  async markAllAsRead() {
    const response = await api.put('/notifications/read-all')
    return response.data
  },

  async deleteNotification(notificationId) {
    const response = await api.delete(`/notifications/${notificationId}`)
    return response.data
  },

  async updateNotificationPreferences(preferences) {
    const response = await api.put('/notifications/preferences', preferences)
    return response.data
  }
} 