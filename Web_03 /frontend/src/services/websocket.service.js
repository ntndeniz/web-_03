import { socketManager } from '@/config/socket'
import { store } from '@/store'
import { captureException } from '@/config/sentry'

class WebSocketService {
  constructor() {
    this.subscriptions = new Map()
    this.retryAttempts = 0
    this.maxRetryAttempts = 3
  }

  initialize(authToken) {
    try {
      socketManager.initialize()
      if (authToken) {
        this.connect(authToken)
      }
      this.setupGlobalListeners()
    } catch (error) {
      captureException(error, { service: 'WebSocketService' })
      console.error('WebSocket servisi başlatılamadı:', error)
    }
  }

  connect(authToken) {
    try {
      socketManager.connect(authToken)
    } catch (error) {
      this.handleConnectionError(error)
    }
  }

  disconnect() {
    socketManager.disconnect()
    this.subscriptions.clear()
  }

  subscribe(channel, callback) {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set())
    }
    this.subscriptions.get(channel).add(callback)
    socketManager.subscribe(channel)
  }

  unsubscribe(channel, callback) {
    if (this.subscriptions.has(channel)) {
      const callbacks = this.subscriptions.get(channel)
      callbacks.delete(callback)
      if (callbacks.size === 0) {
        this.subscriptions.delete(channel)
        socketManager.unsubscribe(channel)
      }
    }
  }

  emit(event, data) {
    socketManager.emit(event, data)
  }

  private setupGlobalListeners() {
    socketManager.socket.on('error', this.handleError.bind(this))
    socketManager.socket.on('reconnect', this.handleReconnect.bind(this))
    socketManager.socket.on('disconnect', this.handleDisconnect.bind(this))
  }

  private handleConnectionError(error) {
    this.retryAttempts++
    if (this.retryAttempts < this.maxRetryAttempts) {
      setTimeout(() => {
        this.connect()
      }, Math.pow(2, this.retryAttempts) * 1000)
    } else {
      store.commit('ui/SET_SOCKET_STATUS', 'failed')
      captureException(error, { 
        service: 'WebSocketService',
        context: 'connection'
      })
    }
  }

  private handleError(error) {
    console.error('WebSocket hatası:', error)
    captureException(error, { 
      service: 'WebSocketService',
      context: 'runtime'
    })
  }

  private handleReconnect(attemptNumber) {
    console.log(`WebSocket yeniden bağlandı (${attemptNumber}. deneme)`)
    this.retryAttempts = 0
    store.commit('ui/SET_SOCKET_STATUS', 'connected')
  }

  private handleDisconnect(reason) {
    console.log('WebSocket bağlantısı kesildi:', reason)
    store.commit('ui/SET_SOCKET_STATUS', 'disconnected')
  }
}

export const webSocketService = new WebSocketService()

export default webSocketService 