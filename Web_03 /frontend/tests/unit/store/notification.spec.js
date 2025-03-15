import { expect } from 'chai'
import { createStore } from 'vuex'
import notification from '@/store/modules/notification'
import NotificationService from '@/services/notification.service'
import sinon from 'sinon'

describe('Notification Store', () => {
  let store
  let mockNotificationService

  beforeEach(() => {
    mockNotificationService = {
      getNotifications: sinon.stub(),
      markAsRead: sinon.stub(),
      deleteNotification: sinon.stub(),
      updatePreferences: sinon.stub()
    }

    store = createStore({
      modules: {
        notification: {
          ...notification,
          actions: {
            ...notification.actions,
            $notificationService: mockNotificationService
          }
        }
      }
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    it('SET_NOTIFICATIONS mutation bildirimleri güncellemeli', () => {
      const notifications = [
        { id: 1, message: 'Test bildirimi 1', read: false },
        { id: 2, message: 'Test bildirimi 2', read: true }
      ]
      store.commit('notification/SET_NOTIFICATIONS', notifications)
      expect(store.state.notification.notifications).to.deep.equal(notifications)
    })

    it('ADD_NOTIFICATION mutation yeni bildirim ekleyebilmeli', () => {
      const notification = { id: 1, message: 'Yeni bildirim', read: false }
      store.commit('notification/ADD_NOTIFICATION', notification)
      expect(store.state.notification.notifications).to.deep.include(notification)
    })

    it('MARK_AS_READ mutation bildirim durumunu güncelleyebilmeli', () => {
      store.commit('notification/SET_NOTIFICATIONS', [
        { id: 1, message: 'Test', read: false }
      ])
      store.commit('notification/MARK_AS_READ', 1)
      expect(store.state.notification.notifications[0].read).to.be.true
    })

    it('DELETE_NOTIFICATION mutation bildirimi silebilmeli', () => {
      store.commit('notification/SET_NOTIFICATIONS', [
        { id: 1, message: 'Test', read: false }
      ])
      store.commit('notification/DELETE_NOTIFICATION', 1)
      expect(store.state.notification.notifications).to.have.lengthOf(0)
    })
  })

  describe('actions', () => {
    it('fetchNotifications action bildirimleri getirmeli', async () => {
      const notifications = [
        { id: 1, message: 'Test bildirimi 1', read: false },
        { id: 2, message: 'Test bildirimi 2', read: true }
      ]

      mockNotificationService.getNotifications.resolves({ data: notifications })

      await store.dispatch('notification/fetchNotifications')
      expect(store.state.notification.notifications).to.deep.equal(notifications)
    })

    it('markAsRead action bildirim durumunu güncelleyebilmeli', async () => {
      store.commit('notification/SET_NOTIFICATIONS', [
        { id: 1, message: 'Test', read: false }
      ])

      mockNotificationService.markAsRead.resolves()

      await store.dispatch('notification/markAsRead', 1)
      expect(store.state.notification.notifications[0].read).to.be.true
    })

    it('deleteNotification action bildirimi silebilmeli', async () => {
      store.commit('notification/SET_NOTIFICATIONS', [
        { id: 1, message: 'Test', read: false }
      ])

      mockNotificationService.deleteNotification.resolves()

      await store.dispatch('notification/deleteNotification', 1)
      expect(store.state.notification.notifications).to.have.lengthOf(0)
    })

    it('updatePreferences action bildirim tercihlerini güncelleyebilmeli', async () => {
      const preferences = {
        email: true,
        push: false,
        sms: true
      }

      mockNotificationService.updatePreferences.resolves({ data: preferences })

      await store.dispatch('notification/updatePreferences', preferences)
      expect(store.state.notification.preferences).to.deep.equal(preferences)
    })
  })

  describe('getters', () => {
    it('unreadCount getter okunmamış bildirim sayısını hesaplamalı', () => {
      store.commit('notification/SET_NOTIFICATIONS', [
        { id: 1, read: false },
        { id: 2, read: true },
        { id: 3, read: false }
      ])
      expect(store.getters['notification/unreadCount']).to.equal(2)
    })

    it('getNotificationById getter bildirim bulabilmeli', () => {
      const notifications = [
        { id: 1, message: 'Test 1' },
        { id: 2, message: 'Test 2' }
      ]
      store.commit('notification/SET_NOTIFICATIONS', notifications)

      const notification = store.getters['notification/getNotificationById'](1)
      expect(notification).to.deep.equal(notifications[0])
    })
  })
}) 