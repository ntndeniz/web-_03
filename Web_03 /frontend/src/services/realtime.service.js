import { webSocketService } from './websocket.service'
import { store } from '@/store'
import { captureException } from '@/config/sentry'

class RealtimeService {
  constructor() {
    this.subscriptions = new Map()
    this.setupEventListeners()
  }

  setupEventListeners() {
    webSocketService.subscribe('realtime', this.handleRealtimeEvent.bind(this))
  }

  subscribeToProduct(productId) {
    try {
      webSocketService.emit('realtime:subscribe', {
        type: 'product',
        id: productId
      })
      this.trackSubscription('product', productId)
    } catch (error) {
      this.handleError(error, 'subscribeToProduct')
    }
  }

  subscribeToOrder(orderId) {
    try {
      webSocketService.emit('realtime:subscribe', {
        type: 'order',
        id: orderId
      })
      this.trackSubscription('order', orderId)
    } catch (error) {
      this.handleError(error, 'subscribeToOrder')
    }
  }

  subscribeToInventory(categoryId) {
    try {
      webSocketService.emit('realtime:subscribe', {
        type: 'inventory',
        id: categoryId
      })
      this.trackSubscription('inventory', categoryId)
    } catch (error) {
      this.handleError(error, 'subscribeToInventory')
    }
  }

  unsubscribe(type, id) {
    try {
      webSocketService.emit('realtime:unsubscribe', { type, id })
      this.removeSubscription(type, id)
    } catch (error) {
      this.handleError(error, 'unsubscribe')
    }
  }

  private handleRealtimeEvent(event) {
    try {
      switch (event.type) {
        case 'product_update':
          store.commit('product/UPDATE_PRODUCT', event.data)
          break
        case 'order_status':
          store.commit('order/UPDATE_ORDER_STATUS', event.data)
          break
        case 'inventory_change':
          store.commit('inventory/UPDATE_STOCK', event.data)
          break
        case 'price_change':
          store.commit('product/UPDATE_PRICE', event.data)
          break
        default:
          console.warn('Bilinmeyen realtime eventi:', event)
      }
    } catch (error) {
      this.handleError(error, 'handleRealtimeEvent')
    }
  }

  private trackSubscription(type, id) {
    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, new Set())
    }
    this.subscriptions.get(type).add(id)
  }

  private removeSubscription(type, id) {
    if (this.subscriptions.has(type)) {
      this.subscriptions.get(type).delete(id)
    }
  }

  private handleError(error, context) {
    console.error(`Realtime hatası (${context}):`, error)
    captureException(error, {
      service: 'RealtimeService',
      context
    })
  }
}

export const realtimeService = new RealtimeService()

export default realtimeService 