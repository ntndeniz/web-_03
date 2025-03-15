// Stripe
declare module '@stripe/stripe-js' {
  export interface StripeElements {
    create: (type: string, options?: any) => any
  }
  
  export interface StripeInstance {
    elements: () => StripeElements
    confirmCardPayment: (clientSecret: string, data: any) => Promise<any>
    confirmPaymentIntent: (clientSecret: string, data: any) => Promise<any>
  }
}

// Firebase
declare module 'firebase/app' {
  export interface FirebaseApp {
    auth: () => any
    firestore: () => any
    storage: () => any
  }
}

// Google Maps
declare module '@googlemaps/js-api-loader' {
  export interface LoaderOptions {
    apiKey: string
    version: string
    libraries?: string[]
    language?: string
    region?: string
  }
}

// Chart.js
declare module 'chart.js' {
  export interface ChartConfiguration {
    type: string
    data: any
    options?: any
  }
}

// i18n
declare module 'vue-i18n' {
  export interface I18nOptions {
    locale: string
    fallbackLocale: string
    messages: Record<string, any>
  }
} 