export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  shipping: ShippingInfo
  billing: BillingInfo
  payment: PaymentInfo
  totals: OrderTotals
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  name: string
  sku: string
  price: number
  quantity: number
  total: number
  image?: string
  attributes?: {
    [key: string]: string
  }
}

export interface ShippingInfo {
  address: Address
  method: ShippingMethod
  trackingNumber?: string
  estimatedDelivery?: Date
  shippedAt?: Date
  deliveredAt?: Date
}

export interface BillingInfo {
  address: Address
  taxNumber?: string
  companyName?: string
}

export interface PaymentInfo {
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  paidAt?: Date
  cardLast4?: string
  installments?: number
}

export interface OrderTotals {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
}

export type ShippingMethod = 'standard' | 'express' | 'nextDay'

export type PaymentMethod = 'creditCard' | 'bankTransfer' | 'paypal'

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

export interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
} 