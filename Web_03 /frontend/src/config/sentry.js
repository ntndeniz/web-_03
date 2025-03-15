import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

export const initSentry = (app, router) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      app,
      dsn: process.env.VUE_APP_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: ['localhost', process.env.VUE_APP_API_URL, /^\//]
        })
      ],
      tracesSampleRate: 1.0,
      logErrors: true,
      environment: process.env.NODE_ENV,
      beforeSend(event) {
        if (event.exception) {
          Sentry.showReportDialog({ eventId: event.event_id })
        }
        return event
      }
    })
  }
}

export const captureException = (error, context = {}) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context
    })
  } else {
    console.error(error)
  }
}

export const setUserContext = (user) => {
  if (process.env.NODE_ENV === 'production' && user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username
    })
  }
} 