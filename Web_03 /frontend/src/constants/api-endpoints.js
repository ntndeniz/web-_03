const API_VERSION = 'v1'
const BASE_URL = process.env.VUE_APP_API_URL || '/api'
const API_URL = `${BASE_URL}/${API_VERSION}`

export const API_ENDPOINTS = {
  // Auth Endpoints
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    LOGOUT: `${API_URL}/auth/logout`,
    REFRESH: `${API_URL}/auth/refresh`,
    FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_URL}/auth/reset-password`,
    VERIFY_EMAIL: `${API_URL}/auth/verify-email`
  },

  // User Endpoints
  USER: {
    PROFILE: `${API_URL}/user/profile`,
    UPDATE_PROFILE: `${API_URL}/user/profile/update`,
    CHANGE_PASSWORD: `${API_URL}/user/password/change`,
    ADDRESSES: `${API_URL}/user/addresses`,
    FAVORITES: `${API_URL}/user/favorites`
  },

  // Product Endpoints
  PRODUCT: {
    LIST: `${API_URL}/products`,
    DETAIL: (id) => `${API_URL}/products/${id}`,
    CATEGORY: (slug) => `${API_URL}/categories/${slug}/products`,
    SEARCH: `${API_URL}/products/search`,
    FEATURED: `${API_URL}/products/featured`
  },

  // Order Endpoints
  ORDER: {
    LIST: `${API_URL}/orders`,
    DETAIL: (id) => `${API_URL}/orders/${id}`,
    CREATE: `${API_URL}/orders`,
    CANCEL: (id) => `${API_URL}/orders/${id}/cancel`
  },

  // Payment Endpoints
  PAYMENT: {
    METHODS: `${API_URL}/payments/methods`,
    PROCESS: `${API_URL}/payments/process`,
    VERIFY: `${API_URL}/payments/verify`
  },

  // Content Endpoints
  CONTENT: {
    PAGES: `${API_URL}/pages`,
    PAGE: (slug) => `${API_URL}/pages/${slug}`,
    FAQ: `${API_URL}/faq`,
    CONTACT: `${API_URL}/contact`
  }
}

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
}

export const API_HEADERS = {
  JSON: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  MULTIPART: {
    'Content-Type': 'multipart/form-data'
  },
  AUTH: (token) => ({
    'Authorization': `Bearer ${token}`
  })
} 