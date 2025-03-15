import { initializeAnalytics } from 'firebase/analytics'
import { GA_TRACKING_ID } from '@/config/constants'
import GoogleAnalytics from '@/analytics/google-analytics'
import FacebookPixel from '@/analytics/facebook-pixel'

/**
 * Analytics servislerini başlat
 */
export const initAnalytics = (app) => {
  // Google Analytics
  GoogleAnalytics.init(GA_TRACKING_ID)
  
  // Facebook Pixel
  FacebookPixel.init()

  // Firebase Analytics
  if (process.env.NODE_ENV === 'production') {
    initializeAnalytics(app)
  }
}

/**
 * Sayfa görüntüleme olayı
 */
export const trackPageView = (pageName) => {
  GoogleAnalytics.pageView(pageName)
  FacebookPixel.pageView()
}

/**
 * Özel olay takibi
 */
export const trackEvent = (eventName, params = {}) => {
  GoogleAnalytics.event(eventName, params)
  FacebookPixel.event(eventName, params)
}

export default {
  initAnalytics,
  trackPageView,
  trackEvent
}