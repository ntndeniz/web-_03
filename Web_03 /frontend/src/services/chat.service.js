import { webSocketService } from './websocket.service'
import { store } from '@/store'
import { captureException } from '@/config/sentry'

class ChatService {
  constructor() {
    this.activeRooms = new Set()
    this.messageQueue = new Map()
    this.setupEventListeners()
  }

  setupEventListeners() {
    webSocketService.subscribe('chat', this.handleChatEvent.bind(this))
  }

  async joinRoom(roomId) {
    try {
      await webSocketService.emit('chat:join', { roomId })
      this.activeRooms.add(roomId)
      await this.loadRoomHistory(roomId)
    } catch (error) {
      this.handleError(error, 'joinRoom')
    }
  }

  async leaveRoom(roomId) {
    try {
      await webSocketService.emit('chat:leave', { roomId })
      this.activeRooms.delete(roomId)
    } catch (error) {
      this.handleError(error, 'leaveRoom')
    }
  }

  async sendMessage(roomId, message) {
    try {
      const messageId = this.generateMessageId()
      const messageData = {
        id: messageId,
        roomId,
        content: message,
        timestamp: new Date().toISOString(),
        status: 'sending'
      }

      // Mesajı önbelleğe al
      this.queueMessage(messageId, messageData)

      // UI'ı güncelle
      store.commit('chat/ADD_MESSAGE', messageData)

      // Mesajı gönder
      await webSocketService.emit('chat:message', messageData)

      // Başarılı gönderim durumunu güncelle
      this.updateMessageStatus(messageId, 'sent')
    } catch (error) {
      this.handleError(error, 'sendMessage')
    }
  }

  async loadRoomHistory(roomId, limit = 50) {
    try {
      const response = await fetch(`/api/chat/history/${roomId}?limit=${limit}`)
      const history = await response.json()
      store.commit('chat/SET_ROOM_HISTORY', { roomId, messages: history })
    } catch (error) {
      this.handleError(error, 'loadRoomHistory')
    }
  }

  private handleChatEvent(event) {
    switch (event.type) {
      case 'message':
        store.commit('chat/ADD_MESSAGE', event.data)
        break
      case 'typing':
        store.commit('chat/SET_TYPING_STATUS', event.data)
        break
      case 'read':
        store.commit('chat/UPDATE_READ_STATUS', event.data)
        break
      default:
        console.warn('Bilinmeyen chat eventi:', event)
    }
  }

  private queueMessage(messageId, messageData) {
    this.messageQueue.set(messageId, messageData)
  }

  private updateMessageStatus(messageId, status) {
    const message = this.messageQueue.get(messageId)
    if (message) {
      message.status = status
      store.commit('chat/UPDATE_MESSAGE_STATUS', { messageId, status })
      if (status === 'sent' || status === 'failed') {
        this.messageQueue.delete(messageId)
      }
    }
  }

  private generateMessageId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private handleError(error, context) {
    console.error(`Chat hatası (${context}):`, error)
    captureException(error, { 
      service: 'ChatService',
      context 
    })
  }
}

export const chatService = new ChatService()

export default chatService 