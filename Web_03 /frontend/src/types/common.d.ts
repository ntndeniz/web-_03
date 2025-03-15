export interface Pagination {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface Modal {
  isOpen: boolean
  component: string | null
  props?: Record<string, any>
  options?: {
    width?: string
    closeable?: boolean
    closeOnClickOutside?: boolean
  }
}

export interface Breadcrumb {
  text: string
  to?: string | Record<string, any>
  disabled?: boolean
}

export interface Tab {
  id: string
  label: string
  icon?: string
  disabled?: boolean
}

export interface MenuItem {
  id: string
  text: string
  icon?: string
  to?: string
  children?: MenuItem[]
  permissions?: string[]
  disabled?: boolean
}

export interface UiState {
  theme: 'light' | 'dark' | 'system'
  language: string
  loading: boolean
  toast: Toast | null
  modal: Modal
  sidebar: {
    isOpen: boolean
    mini: boolean
  }
} 