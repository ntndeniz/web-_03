import { Store } from 'vuex'
import { Router } from 'vue-router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<any>
    $router: Router
    $t: (key: string) => string
    $toast: (message: string, type?: string) => void
    $modal: {
      show: (name: string, props?: any) => void
      hide: (name: string) => void
    }
    $analytics: {
      trackEvent: (name: string, params?: any) => void
      trackPageView: (path: string) => void
    }
  }
}

// Global bileşen prop tipleri
export interface BaseProps {
  id?: string
  class?: string | string[]
  style?: string | object
}

// Global olay tipleri
export interface EventHandlers {
  onClick?: (event: MouseEvent) => void
  onInput?: (event: Event) => void
  onChange?: (event: Event) => void
  onSubmit?: (event: Event) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
} 