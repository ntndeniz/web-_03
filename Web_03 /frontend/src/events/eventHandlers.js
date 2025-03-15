/**
 * Olay işleyicileri
 */

import store from '@/store'
import router from '@/router'
import { notify } from '@/utils/notification'

/**
 * Kimlik doğrulama olaylarını işle
 * @param {Object} data Olay verisi
 */
export const handleAuthEvent = (data) => {
  const { type, payload } = data

  switch (type) {
    case 'auth:login':
      store.dispatch('auth/setUser', payload)
      router.push('/dashboard')
      notify.success('Giriş başarılı')
      break

    case 'auth:logout':
      store.dispatch('auth/clearUser')
      router.push('/login')
      notify.info('Çıkış yapıldı')
      break

    case 'auth:session-expired':
      store.dispatch('auth/clearUser')
      router.push('/login')
      notify.warning('Oturum süresi doldu')
      break

    default:
      break
  }
}

/**
 * Sepet olaylarını işle
 * @param {Object} data Olay verisi
 */
export const handleCartEvent = (data) => {
  const { type, payload } = data

  switch (type) {
    case 'cart:add-item':
      store.dispatch('cart/addItem', payload)
      notify.success('Ürün sepete eklendi')
      break

    case 'cart:remove-item':
      store.dispatch('cart/removeItem', payload)
      notify.info('Ürün sepetten çıkarıldı')
      break

    default:
      break
  }
}

/**
 * Bildirim olaylarını işle
 * @param {Object} data Olay verisi
 */
export const handleNotificationEvent = (data) => {
  const { type, message } = data

  switch (type) {
    case 'notification:success':
      notify.success(message)
      break

    case 'notification:error':
      notify.error(message)
      break

    case 'notification:warning':
      notify.warning(message)
      break

    case 'notification:info':
      notify.info(message)
      break

    default:
      break
  }
} 