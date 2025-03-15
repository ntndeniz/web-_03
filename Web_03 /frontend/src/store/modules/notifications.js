import { db, auth } from '@/firebase'

export default {
  namespaced: true,

  state: {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null
  },

  mutations: {
    SET_NOTIFICATIONS(state, notifications) {
      state.items = notifications
    },
    ADD_NOTIFICATION(state, notification) {
      state.items.unshift(notification)
      if (!notification.read) {
        state.unreadCount++
      }
    },
    MARK_AS_READ(state, notificationId) {
      const notification = state.items.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount--
      }
    },
    MARK_ALL_AS_READ(state) {
      state.items.forEach(notification => {
        notification.read = true
      })
      state.unreadCount = 0
    },
    SET_UNREAD_COUNT(state, count) {
      state.unreadCount = count
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    // Bildirimleri getir
    async fetchNotifications({ commit, rootGetters }) {
      commit('SET_LOADING', true)
      
      try {
        const userId = rootGetters['auth/userId']
        const snapshot = await db.collection('notifications')
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .limit(50)
          .get()

        const notifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Okunmamış bildirimleri say
        const unreadCount = notifications.filter(n => !n.read).length

        commit('SET_NOTIFICATIONS', notifications)
        commit('SET_UNREAD_COUNT', unreadCount)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Yeni bildirim ekle
    async createNotification({ commit }, notificationData) {
      try {
        const docRef = await db.collection('notifications').add({
          ...notificationData,
          read: false,
          createdAt: new Date()
        })

        const newNotification = {
          id: docRef.id,
          ...notificationData,
          read: false,
          createdAt: new Date()
        }

        commit('ADD_NOTIFICATION', newNotification)
      } catch (error) {
        commit('SET_ERROR', error.message)
      }
    },

    // Bildirimi okundu olarak işaretle
    async markAsRead({ commit }, notificationId) {
      try {
        await db.collection('notifications')
          .doc(notificationId)
          .update({
            read: true,
            readAt: new Date()
          })

        commit('MARK_AS_READ', notificationId)
      } catch (error) {
        commit('SET_ERROR', error.message)
      }
    },

    // Tüm bildirimleri okundu olarak işaretle
    async markAllAsRead({ commit, state }) {
      try {
        const batch = db.batch()
        
        state.items.forEach(notification => {
          if (!notification.read) {
            const ref = db.collection('notifications').doc(notification.id)
            batch.update(ref, {
              read: true,
              readAt: new Date()
            })
          }
        })

        await batch.commit()
        commit('MARK_ALL_AS_READ')
      } catch (error) {
        commit('SET_ERROR', error.message)
      }
    },

    // Gerçek zamanlı bildirim dinleyicisi
    subscribeToNotifications({ commit, rootGetters }) {
      const userId = rootGetters['auth/userId']
      
      return db.collection('notifications')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              const notification = {
                id: change.doc.id,
                ...change.doc.data()
              }
              commit('ADD_NOTIFICATION', notification)
            }
          })
        })
    }
  },

  getters: {
    unreadNotifications: state => state.items.filter(n => !n.read),
    notificationById: state => id => state.items.find(n => n.id === id),
    hasUnreadNotifications: state => state.unreadCount > 0
  }
} 