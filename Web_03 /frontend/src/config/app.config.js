/**
 * Uygulama Genel Yapılandırması
 */

export default {
    // Uygulama bilgileri
    name: 'E-Ticaret Platformu',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    
    // API yapılandırması
    api: {
      baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000
    },
  
    // Kimlik doğrulama
    auth: {
      tokenKey: 'auth_token',
      refreshTokenKey: 'refresh_token',
      tokenExpiry: 3600, // 1 saat
      refreshTokenExpiry: 604800 // 1 hafta
    },
  
    // Sayfalama
    pagination: {
      defaultPerPage: 20,
      maxPerPage: 100
    },
  
    // Dosya yükleme
    upload: {
      maxFileSize: 5242880, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
      maxFiles: 5
    },
  
    // Önbellek
    cache: {
      enabled: true,
      duration: 3600 // 1 saat
    },
  
    // Hata izleme
    errorTracking: {
      enabled: true,
      sampleRate: 0.1, // %10
      ignoreErrors: [
        'Network Error',
        'Request aborted'
      ]
    },
  
    // Performans izleme
    performance: {
      enabled: true,
      analyticsEnabled: true,
      logLevel: 'warning'
    }
  }