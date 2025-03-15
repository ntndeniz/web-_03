/**
 * Hata loglama servisi
 */

import { captureException } from '@sentry/vue'

export class ErrorLogger {
  constructor() {
    this.logs = []
  }

  /**
   * Hatayı logla
   * @param {Object} errorData Hata verisi
   */
  log(errorData) {
    // Hatayı Sentry'e gönder
    if (process.env.NODE_ENV === 'production') {
      captureException(errorData.error)
    }

    // Hatayı yerel loglara ekle
    this.logs.push({
      ...errorData,
      id: this.generateLogId(),
      timestamp: new Date().toISOString()
    })

    // Log sayısını kontrol et
    this.cleanOldLogs()
  }

  /**
   * Kritik hatayı logla
   * @param {Object} errorData Hata verisi
   */
  logCritical(errorData) {
    // Kritik hatayı Sentry'e gönder
    if (process.env.NODE_ENV === 'production') {
      captureException(errorData.error, {
        level: 'fatal'
      })
    }

    // Kritik hatayı yerel loglara ekle
    this.logs.push({
      ...errorData,
      id: this.generateLogId(),
      level: 'critical',
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Log ID'si oluştur
   * @returns {string} Log ID
   */
  generateLogId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Eski logları temizle
   */
  cleanOldLogs() {
    const MAX_LOGS = 100
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(-MAX_LOGS)
    }
  }

  /**
   * Logları getir
   * @returns {Array} Log listesi
   */
  getLogs() {
    return this.logs
  }

  /**
   * Logları temizle
   */
  clearLogs() {
    this.logs = []
  }
} 