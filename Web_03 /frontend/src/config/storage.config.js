/**
 * Depolama Yapılandırması
 */

export default {
  // Firebase Storage yapılandırması
  firebase: {
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    maxUploadSize: 10485760, // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    cacheDuration: 3600 // 1 saat
  },

  // Yerel depolama ayarları
  local: {
    basePath: '/uploads',
    maxFileSize: 5242880, // 5MB
    compressionQuality: 0.8,
    thumbnailSizes: {
      small: 150,
      medium: 300,
      large: 600
    }
  },

  // Dosya işleme ayarları
  processing: {
    imageOptimization: true,
    autoRotate: true,
    stripMetadata: true,
    convertToWebp: true
  },

  // Güvenlik ayarları
  security: {
    validateMimeType: true,
    scanForMalware: true,
    maxFilenameLength: 100,
    sanitizeFilenames: true
  },

  // CDN yapılandırması
  cdn: {
    enabled: process.env.NODE_ENV === 'production',
    baseUrl: process.env.VUE_APP_CDN_URL,
    cacheControl: 'public, max-age=31536000'
  }
} 