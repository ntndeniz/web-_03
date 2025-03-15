/**
 * Oturum Yapılandırması
 */

export default {
    // Oturum ayarları
    settings: {
      tokenKey: 'session_token',
      duration: 3600, // 1 saat
      renewThreshold: 300, // 5 dakika
      persistent: false
    },
  
    // Oturum güvenliği
    security: {
      csrf: {
        enabled: true,
        headerName: 'X-CSRF-TOKEN'
      },
      fingerprint: {
        enabled: true,
        attributes: ['userAgent', 'language', 'timezone']
      }
    },
  
    // Oturum yönetimi
    management: {
      maxConcurrentSessions: 3,
      singleSession: false,
      forceLogoutOnPasswordChange: true
    },
  
    // Oturum izleme
    tracking: {
      enabled: true,
      attributes: {
        ip: true,
        location: true,
        device: true
      }
    },
  
    // Oturum olayları
    events: {
      onExpire: () => {
        // Oturum süresi dolduğunda
        redirectToLogin()
      },
      onInvalid: () => {
        // Geçersiz oturum durumunda
        handleInvalidSession()
      },
      onChange: (sessionData) => {
        // Oturum değiştiğinde
        updateSessionUI(sessionData)
      }
    },
  
    // Oturum doğrulama
    validation: {
      interval: 60, // 1 dakika
      endpoints: {
        check: '/api/auth/session/check',
        refresh: '/api/auth/session/refresh'
      }
    }
  }
  
  function redirectToLogin() {
    window.location.href = '/login'
  }
  
  function handleInvalidSession() {
    // Geçersiz oturum işleme mantığı
  }
  
  function updateSessionUI(sessionData) {
    // UI güncelleme mantığı
  }