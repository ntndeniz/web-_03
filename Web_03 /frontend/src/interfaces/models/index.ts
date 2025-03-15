// User Model
export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  avatar?: string
  role: string
  permissions: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Product Model
export interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  sku: string
  barcode?: string
  images: string[]
  category: Category
  brand?: Brand
  tags: string[]
  attributes: ProductAttribute[]
  rating: number
  reviewCount: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

// Category Model
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: Category
  children?: Category[]
  productCount: number
  isActive: boolean
}

// Order Model
export interface Order {
  id: string
  orderNumber: string
  user: User
  items: OrderItem[]
  status: OrderStatus
  paymentStatus: PaymentStatus
  shippingAddress: Address
  billingAddress: Address
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Address Model
export interface Address {
  id: string
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
  isDefault: boolean
}

// Supporting Types
export interface ProductAttribute {
  name: string
  value: string
}

export interface OrderItem {
  product: Product
  quantity: number
  price: number
  total: number
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}