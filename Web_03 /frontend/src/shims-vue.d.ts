/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// SVG dosyaları için tip tanımı
declare module '*.svg' {
  const content: string
  export default content
}

// SCSS modülleri için tip tanımı
declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

// ENV değişkenleri için tip tanımı
interface ImportMetaEnv {
  VITE_APP_TITLE: string
  VITE_APP_API_URL: string
  VITE_APP_FIREBASE_CONFIG: string
  // diğer env değişkenleri...
}

// Vite için tip tanımı
interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Window nesnesi için özel özellikler
declare interface Window {
  // Global değişkenler
  __INITIAL_STATE__: any
  __APP_VERSION__: string
  
  // Third-party kütüphaneler
  dataLayer: any[]
  fbq: Function
  gtag: Function
} 