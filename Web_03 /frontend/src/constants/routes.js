export const ROUTES = {
  // Auth Routes
  AUTH: {
    LOGIN: '/giris',
    REGISTER: '/kayit',
    FORGOT_PASSWORD: '/sifremi-unuttum',
    RESET_PASSWORD: '/sifre-sifirlama',
    VERIFY_EMAIL: '/email-dogrulama'
  },

  // User Routes
  USER: {
    PROFILE: '/profil',
    SETTINGS: '/ayarlar',
    ORDERS: '/siparislerim',
    FAVORITES: '/favorilerim',
    ADDRESSES: '/adreslerim'
  },

  // Product Routes
  PRODUCT: {
    LIST: '/urunler',
    DETAIL: '/urun/:slug',
    CATEGORY: '/kategori/:slug',
    SEARCH: '/arama'
  },

  // Cart Routes
  CART: {
    INDEX: '/sepet',
    CHECKOUT: '/odeme',
    SUCCESS: '/siparis-basarili',
    FAILED: '/siparis-hatali'
  },

  // Content Routes
  CONTENT: {
    ABOUT: '/hakkimizda',
    CONTACT: '/iletisim',
    FAQ: '/sss',
    PRIVACY: '/gizlilik',
    TERMS: '/kullanim-sartlari'
  },

  // Admin Routes
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/urunler',
    ORDERS: '/admin/siparisler',
    USERS: '/admin/kullanicilar',
    SETTINGS: '/admin/ayarlar'
  }
}

export const ROUTE_NAMES = {
  // Auth Route Names
  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register',
    FORGOT_PASSWORD: 'forgot-password',
    RESET_PASSWORD: 'reset-password',
    VERIFY_EMAIL: 'verify-email'
  },

  // User Route Names
  USER: {
    PROFILE: 'user-profile',
    SETTINGS: 'user-settings',
    ORDERS: 'user-orders',
    FAVORITES: 'user-favorites',
    ADDRESSES: 'user-addresses'
  },

  // Product Route Names
  PRODUCT: {
    LIST: 'product-list',
    DETAIL: 'product-detail',
    CATEGORY: 'product-category',
    SEARCH: 'product-search'
  },

  // Cart Route Names
  CART: {
    INDEX: 'cart',
    CHECKOUT: 'checkout',
    SUCCESS: 'order-success',
    FAILED: 'order-failed'
  }
} 