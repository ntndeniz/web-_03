// Auth Requests
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  username: string
  firstName: string
  lastName: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordUpdateRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// User Requests
export interface UpdateProfileRequest {
  firstName: string
  lastName: string
  avatar?: File
  phone?: string
}

export interface AddressCreateRequest {
  title: string
  firstName: string
  lastName: string
  phone: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
}

// Product Requests
export interface ProductCreateRequest {
  title: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  sku: string
  barcode?: string
  images: File[]
  categoryId: string
  brandId?: string
  tags: string[]
  attributes: Array<{
    name: string
    value: string
  }>
  isPublished?: boolean
}

// Order Requests
export interface OrderCreateRequest {
  items: Array<{
    productId: string
    quantity: number
  }>
  shippingAddressId: string
  billingAddressId: string
  notes?: string
}

// Search & Filter Requests
export interface ProductSearchRequest {
  query?: string
  categoryId?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price' | 'rating' | 'newest'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}