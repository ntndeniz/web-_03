import { io } from 'socket.io-client'
import { store } from '@/store'

const SOCKET_URL = process.env.VUE_APP_SOCKET_URL || 'ws://localhost:3000'

class SocketManager {
  constructor() {
    this.socket = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
  }

  initialize() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts
    })

    this.setupEventListeners()
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Socket bağlantısı kuruldu')
      this.reconnectAttempts = 0
      store.commit('ui/SET_SOCKET_STATUS', 'connected')
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket bağlantısı kesildi:', reason)
      store.commit('ui/SET_SOCKET_STATUS', 'disconnected')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket bağlantı hatası:', error)
      this.reconnectAttempts++
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.socket.disconnect()
        store.commit('ui/SET_SOCKET_STATUS', 'failed')
      }
    })

    // Özel event dinleyicileri
    this.socket.on('notification', (data) => {
      store.dispatch('notification/addNotification', data)
    })

    this.socket.on('order_status_changed', (data) => {
      store.dispatch('order/updateOrderStatus', data)
    })

    this.socket.on('chat_message', (data) => {
      store.dispatch('chat/receiveMessage', data)
    })
  }

  connect(authToken) {
    if (this.socket && !this.socket.connected) {
      this.socket.auth = { token: authToken }
      this.socket.connect()
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('Socket bağlı değil, event gönderilemedi:', event)
    }
  }

  subscribe(channel) {
    this.emit('subscribe', { channel })
  }

  unsubscribe(channel) {
    this.emit('unsubscribe', { channel })
  }
}

export const socketManager = new SocketManager()

export const initializeSocket = (authToken) => {
  socketManager.initialize()
  if (authToken) {
    socketManager.connect(authToken)
  }
}

export default socketManager 