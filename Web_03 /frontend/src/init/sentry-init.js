import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import { SENTRY_DSN } from '@/config/constants'

/**
 * Sentry'yi başlat
 */
export const initSentry = (app, router) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      app,
      dsn: SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: ['localhost', 'my-site-url.com', /^\//]
        })
      ],
      tracesSampleRate: 1.0,
      logErrors: true,
      environment: process.env.NODE_ENV
    })
  }
}

/**
 * Hata yakala
 */
export const captureException = (error, context = {}) => {
  Sentry.captureException(error, context)
}

/**
 * Mesaj yakala
 */
export const captureMessage = (message, level = 'info') => {
  Sentry.captureMessage(message, level)
}

export default {
  initSentry,
  captureException,
  captureMessage
}