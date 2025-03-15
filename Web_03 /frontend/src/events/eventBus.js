/**
 * Event Bus - Bileşenler arası iletişim için merkezi olay yönetimi
 */

import { reactive } from 'vue'
import { EVENT_TYPES } from './eventTypes'
import { handleAuthEvent, handleCartEvent, handleNotificationEvent } from './eventHandlers'

class EventBus {
  constructor() {
    this.events = reactive({})
    this.handlers = {
      [EVENT_TYPES.AUTH]: handleAuthEvent,
      [EVENT_TYPES.CART]: handleCartEvent,
      [EVENT_TYPES.NOTIFICATION]: handleNotificationEvent
    }
  }

  /**
   * Olay dinleyicisi ekle
   * @param {string} event Olay adı
   * @param {Function} callback Geri çağırım fonksiyonu
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  /**
   * Olay dinleyicisini kaldır
   * @param {string} event Olay adı
   * @param {Function} callback Geri çağırım fonksiyonu
   */
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }

  /**
   * Olay tetikle
   * @param {string} event Olay adı
   * @param {*} data Olay verisi
   */
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        callback(data)
      })
    }

    // Özel olay işleyicilerini çalıştır
    if (this.handlers[event]) {
      this.handlers[event](data)
    }
  }

  /**
   * Tüm olay dinleyicilerini temizle
   */
  clear() {
    this.events = {}
  }
}

export default new EventBus() 