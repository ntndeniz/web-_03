/**
 * Hata sınırlayıcı bileşen
 */

import { ErrorLogger } from './ErrorLogger'
import { notify } from '@/utils/notification'

export default class ErrorBoundary {
  constructor() {
    this.errorLogger = new ErrorLogger()
  }

  /**
   * Hatayı yakala ve işle
   * @param {Error} error Hata nesnesi
   * @param {Object} vm Vue bileşeni
   * @param {string} info Hata bilgisi
   */
  handle(error, vm, info) {
    // Hatayı logla
    this.errorLogger.log({
      error,
      component: vm.$options.name,
      info,
      timestamp: new Date().toISOString()
    })

    // Kullanıcıya bilgi ver
    notify.error('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.')

    // Geliştirici konsoluna hata bilgisini yaz
    if (process.env.NODE_ENV === 'development') {
      console.error('Hata yakalandı:', {
        error,
        component: vm.$options.name,
        info
      })
    }
  }

  /**
   * Kritik hatayı işle
   * @param {Error} error Hata nesnesi
   */
  handleCritical(error) {
    // Kritik hatayı logla
    this.errorLogger.logCritical({
      error,
      timestamp: new Date().toISOString()
    })

    // Kullanıcıyı hata sayfasına yönlendir
    window.location.href = '/error'
  }
} 