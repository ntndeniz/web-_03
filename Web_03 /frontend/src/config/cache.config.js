/**
 * Önbellek Yapılandırması
 */

export default {
    // Önbellek stratejisi
    strategy: 'localStorage', // 'localStorage' | 'sessionStorage' | 'indexedDB'
  
    // Önbellek ayarları
    settings: {
      prefix: 'app_cache_',
      defaultTTL: 3600, // 1 saat
      maxSize: 10485760, // 10MB
      compression: true
    },
  
    // Önbelleklenecek veriler
    rules: {
      products: {
        ttl: 1800, // 30 dakika
        invalidateOn: ['product:update', 'product:delete']
      },
      categories: {
        ttl: 3600, // 1 saat
        invalidateOn: ['category:update']
      },
      user: {
        ttl: 300, // 5 dakika
        invalidateOn: ['user:update', 'auth:logout']
      }
    },
  
    // Önbellek temizleme kuralları
    cleanup: {
      interval: 3600, // 1 saat
      maxAge: 86400, // 1 gün
      maxEntries: 100
    },
  
    // Önbellek istisnaları
    exceptions: {
      paths: [
        '/api/auth/*',
        '/api/checkout/*'
      ],
      methods: ['POST', 'PUT', 'DELETE']
    },
  
    // Önbellek olayları
    events: {
      onError: (error) => {
        console.error('Cache error:', error)
      },
      onQuotaExceeded: () => {
        // Eski önbellek verilerini temizle
        clearOldCache()
      }
    }
  }
  
  function clearOldCache() {
    // Eski önbellek verilerini temizleme mantığı
  }