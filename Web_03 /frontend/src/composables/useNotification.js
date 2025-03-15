import { computed } from 'vue'
import { useStore } from 'vuex'

export function useNotification() {
  const store = useStore()

  const notifications = computed(() => store.getters['notification/notifications'])
  const unreadCount = computed(() => store.getters['notification/unreadCount'])

  const fetchNotifications = async () => {
    try {
      await store.dispatch('notification/fetchNotifications')
    } catch (error) {
      throw error
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await store.dispatch('notification/markAsRead', notificationId)
    } catch (error) {
      throw error
    }
  }

  const markAllAsRead = async () => {
    try {
      await store.dispatch('notification/markAllAsRead')
    } catch (error) {
      throw error
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await store.dispatch('notification/deleteNotification', notificationId)
    } catch (error) {
      throw error
    }
  }

  const clearAllNotifications = async () => {
    try {
      await store.dispatch('notification/clearAllNotifications')
    } catch (error) {
      throw error
    }
  }

  const showToast = (message, type = 'info', duration = 3000) => {
    store.dispatch('ui/showToast', { message, type, duration })
  }

  const showModal = (options) => {
    store.dispatch('ui/showModal', options)
  }

  const hideModal = () => {
    store.dispatch('ui/hideModal')
  }

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    showToast,
    showModal,
    hideModal
  }
} 