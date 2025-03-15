declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    VUE_APP_API_URL: string
    VUE_APP_FIREBASE_API_KEY: string
    VUE_APP_FIREBASE_AUTH_DOMAIN: string
    VUE_APP_FIREBASE_PROJECT_ID: string
    VUE_APP_FIREBASE_STORAGE_BUCKET: string
    VUE_APP_FIREBASE_MESSAGING_SENDER_ID: string
    VUE_APP_FIREBASE_APP_ID: string
    VUE_APP_STRIPE_PUBLIC_KEY: string
    VUE_APP_GOOGLE_MAPS_API_KEY: string
    VUE_APP_SENTRY_DSN: string
    VUE_APP_GA_TRACKING_ID: string
    VUE_APP_FB_PIXEL_ID: string
    VUE_APP_I18N_LOCALE: string
    VUE_APP_I18N_FALLBACK_LOCALE: string
  }
}

// Vite ortam değişkenleri
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_GA_TRACKING_ID: string
  readonly VITE_FB_PIXEL_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 