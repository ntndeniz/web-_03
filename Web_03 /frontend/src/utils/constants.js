// API Endpoint'leri
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email'
  },
  USER: {
    PROFILE: '/user/profile',
    ADDRESSES: '/user/addresses',
    ORDERS: '/user/orders',
    FAVORITES: '/user/favorites',
    NOTIFICATIONS: '/user/notifications'
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:id',
    SEARCH: '/products/search',
    CATEGORIES: '/categories',
    REVIEWS: '/products/:id/reviews'
  },
  CART: {
    ITEMS: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear'
  }
};

// Sayfalama sabitleri
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

// Dosya yükleme sabitleri
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
  MAX_FILES: 5
};

// Sipariş durumları
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Ödeme yöntemleri
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery'
};

// Kullanıcı rolleri
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

// Hata mesajları
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edin.',
  SERVER_ERROR: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
  AUTH_ERROR: 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.',
  VALIDATION_ERROR: 'Form bilgilerini kontrol edin.',
  NOT_FOUND: 'İstediğiniz sayfa bulunamadı.'
}; 