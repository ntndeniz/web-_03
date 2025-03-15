export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: UserRole
  status: UserStatus
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export type UserRole = 'user' | 'admin' | 'moderator'

export type UserStatus = 'active' | 'inactive' | 'banned'

export interface UserProfile extends User {
  addresses: Address[]
  preferences: UserPreferences
  notificationSettings: NotificationSettings
  orderCount: number
  totalSpent: number
}

export interface Address {
  id: string
  title: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  district: string
  zipCode: string
  isDefault: boolean
}

export interface UserPreferences {
  language: string
  currency: string
  theme: 'light' | 'dark' | 'system'
  newsletter: boolean
  marketing: boolean
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  orderUpdates: boolean
  promotions: boolean
  security: boolean
}

export interface UserState {
  profile: UserProfile | null
  addresses: Address[]
  loading: boolean
  error: string | null
} 