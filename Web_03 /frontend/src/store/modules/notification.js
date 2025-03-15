import NotificationService from '@/services/notification.service';

export default {
  namespaced: true,

  state: {
    notifications: [],
    unreadCount: 0,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 10
    },
    loading: false,
    error: null
  },

  getters: {
    allNotifications: state => state.notifications,
    unreadNotifications: state => {
      return state.notifications.filter(n => !n.read);
    },
    getUnreadCount: state => state.unreadCount,
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    getError: state => state.error,
    hasUnreadNotifications: state => state.unreadCount > 0,
    notificationById: state => id => {
      return state.notifications.find(n => n.id === id);
    }
  },

  mutations: {
    SET_NOTIFICATIONS(state, notifications) {
      state.notifications = notifications;
    },
    SET_UNREAD_COUNT(state, count) {
      state.unreadCount = count;
    },
    ADD_NOTIFICATION(state, notification) {
      state.notifications.unshift(notification);
      state.unreadCount++;
    },
    MARK_AS_READ(state, notificationId) {
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount--;
      }
    },
    MARK_ALL_AS_READ(state) {
      state.notifications.forEach(n => {
        if (!n.read) n.read = true;
      });
      state.unreadCount = 0;
    },
    REMOVE_NOTIFICATION(state, notificationId) {
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = { ...state.pagination, ...pagination };
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  actions: {
    async fetchNotifications({ commit, state }) {
      try {
        commit('SET_LOADING', true);
        const response = await NotificationService.getNotifications({
          page: state.pagination.currentPage,
          limit: state.pagination.perPage
        });
        
        commit('SET_NOTIFICATIONS', response.data.notifications);
        commit('SET_UNREAD_COUNT', response.data.unreadCount);
        commit('SET_PAGINATION', {
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems
        });
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async markAsRead({ commit }, notificationId) {
      try {
        commit('SET_LOADING', true);
        await NotificationService.markAsRead(notificationId);
        commit('MARK_AS_READ', notificationId);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async markAllAsRead({ commit }) {
      try {
        commit('SET_LOADING', true);
        await NotificationService.markAllAsRead();
        commit('MARK_ALL_AS_READ');
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteNotification({ commit }, notificationId) {
      try {
        commit('SET_LOADING', true);
        await NotificationService.deleteNotification(notificationId);
        commit('REMOVE_NOTIFICATION', notificationId);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
}; 