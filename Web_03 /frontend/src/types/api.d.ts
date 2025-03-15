// API Yanıt Tipleri
export interface ApiResponse<T = any> {
    data: T
    status: number
    message: string
    success: boolean
  }
  
  // API Hata Tipi
  export interface ApiError {
    code: string
    message: string
    details?: any
  }
  
  // Sayfalama Tipi
  export interface PaginationParams {
    page: number
    limit: number
    sort?: string
    order?: 'asc' | 'desc'
  }
  
  // Filtre Tipi
  export interface FilterParams {
    search?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    brand?: string[]
    rating?: number
    inStock?: boolean
  }
  
  // API İstek Seçenekleri
  export interface RequestOptions {
    headers?: Record<string, string>
    params?: Record<string, any>
    timeout?: number
    withCredentials?: boolean
  }
  
  // API Endpoint Tipleri
  export interface Endpoints {
    auth: {
      login: string
      register: string
      logout: string
      refresh: string
    }
    users: {
      profile: string
      update: string
      delete: string
    }
    products: {
      list: string
      detail: string
      create: string
      update: string
      delete: string
    }
    orders: {
      list: string
      detail: string
      create: string
      cancel: string
    }
  }