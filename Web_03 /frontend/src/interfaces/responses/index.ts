import { User, Product, Order, Category } from '../models'

// Base Response Interface
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

// Pagination Interface
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Auth Responses
export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

export interface RegisterResponse {
  user: User
  token: string
}

// User Responses
export interface ProfileResponse {
  user: User
  addresses: Address[]
  orders: Order[]
}

export interface AddressResponse {
  addresses: Address[]
}

// Product Responses
export interface ProductListResponse extends PaginatedResponse<Product> {
  filters: {
    categories: Category[]
    brands: Brand[]
    priceRange: {
      min: number
      max: number
    }
  }
}

export interface ProductDetailResponse {
  product: Product
  relatedProducts: Product[]
}

// Order Responses
export interface OrderListResponse extends PaginatedResponse<Order> {}

export interface OrderDetailResponse {
  order: Order
  timeline: Array<{
    status: string
    timestamp: Date
    description: string
  }>
}

// Error Responses
export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

// Dashboard Responses
export interface DashboardResponse {
  stats: {
    totalOrders: number
    totalSales: number
    averageOrderValue: number
    topProducts: Product[]
    recentOrders: Order[]
  }
  charts: {
    salesByDay: Array<{
      date: string
      amount: number
    }>
    ordersByStatus: Array<{
      status: string
      count: number
    }>
  }
}