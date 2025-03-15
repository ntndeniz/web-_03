export const VALIDATION_RULES = {
  // Auth Validations
  AUTH: {
    EMAIL: {
      required: true,
      email: true,
      min: 5,
      max: 255
    },
    PASSWORD: {
      required: true,
      min: 8,
      max: 32,
      containsUppercase: true,
      containsNumber: true,
      containsSpecial: true
    },
    USERNAME: {
      required: true,
      min: 3,
      max: 50,
      alphanumeric: true
    }
  },

  // User Validations
  USER: {
    NAME: {
      required: true,
      min: 2,
      max: 50
    },
    PHONE: {
      required: true,
      phone: true
    },
    ADDRESS: {
      required: true,
      min: 10,
      max: 255
    }
  },

  // Product Validations
  PRODUCT: {
    TITLE: {
      required: true,
      min: 3,
      max: 100
    },
    DESCRIPTION: {
      required: true,
      min: 10,
      max: 1000
    },
    PRICE: {
      required: true,
      numeric: true,
      min: 0
    },
    STOCK: {
      required: true,
      integer: true,
      min: 0
    }
  },

  // Common Validations
  COMMON: {
    REQUIRED: { required: true },
    EMAIL: { email: true },
    URL: { url: true },
    NUMERIC: { numeric: true },
    INTEGER: { integer: true },
    DECIMAL: { decimal: true }
  }
}

export const VALIDATION_MESSAGES = {
  required: 'Bu alan zorunludur',
  email: 'Geçerli bir e-posta adresi giriniz',
  min: 'En az {min} karakter olmalıdır',
  max: 'En fazla {max} karakter olmalıdır',
  url: 'Geçerli bir URL giriniz',
  numeric: 'Sayısal bir değer giriniz',
  integer: 'Tam sayı giriniz',
  decimal: 'Ondalıklı sayı giriniz',
  phone: 'Geçerli bir telefon numarası giriniz',
  alphanumeric: 'Sadece harf ve rakam kullanınız'
} 