/**
 * Uygulama genelinde kullanılan olay tipleri
 */

export const EVENT_TYPES = {
  // Kimlik doğrulama olayları
  AUTH: {
    LOGIN: 'auth:login',
    LOGOUT: 'auth:logout',
    REGISTER: 'auth:register',
    PASSWORD_RESET: 'auth:password-reset',
    SESSION_EXPIRED: 'auth:session-expired'
  },

  // Sepet olayları
  CART: {
    ADD_ITEM: 'cart:add-item',
    REMOVE_ITEM: 'cart:remove-item',
    UPDATE_QUANTITY: 'cart:update-quantity',
    CLEAR: 'cart:clear',
    CHECKOUT: 'cart:checkout'
  },

  // Bildirim olayları
  NOTIFICATION: {
    SUCCESS: 'notification:success',
    ERROR: 'notification:error',
    WARNING: 'notification:warning',
    INFO: 'notification:info'
  },

  // Ürün olayları
  PRODUCT: {
    VIEW: 'product:view',
    FAVORITE: 'product:favorite',
    REVIEW: 'product:review',
    STOCK_UPDATE: 'product:stock-update'
  },

  // Sipariş olayları
  ORDER: {
    CREATE: 'order:create',
    UPDATE: 'order:update',
    CANCEL: 'order:cancel',
    REFUND: 'order:refund'
  },

  // Kullanıcı olayları
  USER: {
    UPDATE_PROFILE: 'user:update-profile',
    UPDATE_SETTINGS: 'user:update-settings',
    DELETE_ACCOUNT: 'user:delete-account'
  }
} 