export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  stock: number
  sku: string
  barcode?: string
  images: string[]
  thumbnail: string
  category: Category
  brand?: Brand
  attributes: ProductAttribute[]
  variants: ProductVariant[]
  ratings: {
    average: number
    count: number
  }
  status: ProductStatus
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: Category
  children?: Category[]
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
}

export interface ProductAttribute {
  name: string
  value: string
}

export interface ProductVariant {
  id: string
  sku: string
  name: string
  price: number
  compareAtPrice?: number
  stock: number
  attributes: ProductAttribute[]
  image?: string
}

export type ProductStatus = 'active' | 'inactive' | 'draft' | 'outOfStock'

export interface ProductFilters {
  search?: string
  category?: string[]
  brand?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  rating?: number
}

export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rating' | 'popularity'

export interface ProductState {
  products: Product[]
  currentProduct: Product | null
  categories: Category[]
  loading: boolean
  error: string | null
  filters: ProductFilters
  sort: ProductSort
  pagination: Pagination
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  order: number
  isDefault: boolean
}

export interface ProductRating {
  average: number
  count: number
  distribution: {
    [key: number]: number
  }
}

export interface Pagination {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface ProductRating {
  average: number
  count: number
  distribution: {
    [key: number]: number
  }
} 