import ApiService from './api.service';

const UserService = {
  // Profil işlemleri
  getProfile() {
    return ApiService.get('/user/profile');
  },

  updateProfile(data) {
    return ApiService.put('/user/profile', data);
  },

  uploadProfilePhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    return ApiService.post('/user/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Adres işlemleri
  getAddresses() {
    return ApiService.get('/user/addresses');
  },

  addAddress(address) {
    return ApiService.post('/user/addresses', address);
  },

  updateAddress(id, address) {
    return ApiService.put(`/user/addresses/${id}`, address);
  },

  deleteAddress(id) {
    return ApiService.delete(`/user/addresses/${id}`);
  },

  setDefaultAddress(id) {
    return ApiService.put(`/user/addresses/${id}/default`);
  },

  // Favoriler
  getFavorites() {
    return ApiService.get('/user/favorites');
  },

  addToFavorites(productId) {
    return ApiService.post('/user/favorites', { productId });
  },

  removeFromFavorites(productId) {
    return ApiService.delete(`/user/favorites/${productId}`);
  },

  // Bildirim tercihleri
  getNotificationPreferences() {
    return ApiService.get('/user/notification-preferences');
  },

  updateNotificationPreferences(preferences) {
    return ApiService.put('/user/notification-preferences', preferences);
  },

  async getOrders(params = {}) {
    try {
      const response = await ApiService.get('/user/orders', { params });
      return response;
    } catch (error) {
      throw new Error('Sipariş geçmişi alınırken bir hata oluştu');
    }
  },

  async getOrderDetails(orderId) {
    try {
      const response = await ApiService.get(`/user/orders/${orderId}`);
      return response;
    } catch (error) {
      throw new Error('Sipariş detayları alınırken bir hata oluştu');
    }
  },

  async getWishlist() {
    try {
      const response = await ApiService.get('/user/wishlist');
      return response;
    } catch (error) {
      throw new Error('İstek listesi alınırken bir hata oluştu');
    }
  },

  async addToWishlist(productId) {
    try {
      const response = await ApiService.post('/user/wishlist', { productId });
      return response;
    } catch (error) {
      throw new Error('Ürün istek listesine eklenirken bir hata oluştu');
    }
  },

  async removeFromWishlist(productId) {
    try {
      const response = await ApiService.delete(`/user/wishlist/${productId}`);
      return response;
    } catch (error) {
      throw new Error('Ürün istek listesinden çıkarılırken bir hata oluştu');
    }
  },

  async getNotifications(params = {}) {
    try {
      const response = await ApiService.get('/user/notifications', { params });
      return response;
    } catch (error) {
      throw new Error('Bildirimler alınırken bir hata oluştu');
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      const response = await ApiService.put(`/user/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      throw new Error('Bildirim okundu olarak işaretlenirken bir hata oluştu');
    }
  },

  async markAllNotificationsAsRead() {
    try {
      const response = await ApiService.put('/user/notifications/read-all');
      return response;
    } catch (error) {
      throw new Error('Bildirimler okundu olarak işaretlenirken bir hata oluştu');
    }
  },

  async deleteAccount(reason) {
    try {
      const response = await ApiService.post('/user/delete-account', { reason });
      return response;
    } catch (error) {
      throw new Error('Hesap silinirken bir hata oluştu');
    }
  }
};

export default UserService; 