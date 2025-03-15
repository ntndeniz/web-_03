/**
 * Hata raporlama servisi
 */

import { ErrorLogger } from './ErrorLogger'
import { notify } from '@/utils/notification'

export class ErrorReporter {
  constructor() {
    this.errorLogger = new ErrorLogger()
  }

  /**
   * API hatalarını raporla
   * @param {Error} error Hata nesnesi
   */
  reportApiError(error) {
    this.errorLogger.log({
      type: 'API_ERROR',
      error,
      timestamp: new Date().toISOString()
    })

    notify.error('API isteği başarısız oldu. Lütfen daha sonra tekrar deneyin.')
  }

  /**
   * Validasyon hatalarını raporla
   * @param {Object} errors Validasyon hataları
   */
  reportValidationErrors(errors) {
    this.errorLogger.log({
      type: 'VALIDATION_ERROR',
      errors,
      timestamp: new Date().toISOString()
    })

    Object.values(errors).forEach(error => {
      notify.warning(error)
    })
  }

  /**
   * İş mantığı hatalarını raporla
   * @param {Error} error Hata nesnesi
   */
  reportBusinessError(error) {
    this.errorLogger.log({
      type: 'BUSINESS_ERROR',
      error,
      timestamp: new Date().toISOString()
    })

    notify.error(error.message)
  }

  /**
   * Teknik hataları raporla
   * @param {Error} error Hata nesnesi
   */
  reportTechnicalError(error) {
    this.errorLogger.logCritical({
      type: 'TECHNICAL_ERROR',
      error,
      timestamp: new Date().toISOString()
    })

    notify.error('Teknik bir hata oluştu. Teknik ekibimiz bilgilendirildi.')
  }
}

export default new ErrorReporter() 