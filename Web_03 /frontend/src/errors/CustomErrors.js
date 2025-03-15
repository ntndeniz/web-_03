/**
 * Özel hata sınıfları
 */

/**
 * API Hatası
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Validasyon Hatası
 */
export class ValidationError extends Error {
  constructor(errors) {
    super('Validasyon hatası')
    this.name = 'ValidationError'
    this.errors = errors
  }
}

/**
 * Yetkilendirme Hatası
 */
export class AuthorizationError extends Error {
  constructor(message = 'Bu işlem için yetkiniz yok') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

/**
 * İş Mantığı Hatası
 */
export class BusinessError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'BusinessError'
    this.code = code
  }
}

/**
 * Ağ Hatası
 */
export class NetworkError extends Error {
  constructor(message = 'Ağ bağlantısı hatası') {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * Oturum Hatası
 */
export class SessionError extends Error {
  constructor(message = 'Oturum süresi doldu') {
    super(message)
    this.name = 'SessionError'
  }
} 